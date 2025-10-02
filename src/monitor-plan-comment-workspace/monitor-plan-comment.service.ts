import { HttpStatus, Injectable } from '@nestjs/common';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 } from 'uuid';
import { CheckCatalogService, EaseyException } from '@us-epa-camd/easey-common';

import { settlePromises, withTransaction } from '../utils';
import {
  MonitorPlanCommentBaseDTO,
  MonitorPlanCommentDTO
} from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import {  throwIfErrors } from '../utils';

const KEY = 'Monitor Plan Comment';
@Injectable()
export class MonitorPlanCommentWorkspaceService {
  constructor(
    private readonly monitorPlanWorkspaceRepository: MonitorPlanWorkspaceRepository,
    private readonly repository: MonitorPlanCommentWorkspaceRepository,
    private readonly map: MonitorPlanCommentMap,
    private readonly entityManager: EntityManager,
  ) { }

  async runChecks(
    monitorPlanComment: MonitorPlanCommentBaseDTO,
    planId: string,
    excludeCommentId?: string
  ) {
    let errorList: string[] = [];
    let error: string = null;

    const monitorPlan = await this.entityManager.findOne(MonitorPlan, {
      where: { id: planId },
      select: ['submissionAvailabilityCode']
    });

    if (!monitorPlan) {
      throw new EaseyException(
        new Error('Monitor Plan not found'),
        HttpStatus.NOT_FOUND,
        { planId }
      );
    }
    error = await this.monplan3Check(
      monitorPlanComment,
      monitorPlan.submissionAvailabilityCode,
      excludeCommentId
    );

    if (error) {
      errorList.push(error);
    }

    throwIfErrors(errorList);
  }

  private async monplan3Check(
    monitorPlanComment: MonitorPlanCommentBaseDTO,
    submissionAvailabilityCode: string,
    excludeCommentId?: string
  ): Promise<string> {
    const { monitoringPlanComment, beginDate, endDate } = monitorPlanComment;

    // MONPLAN-3 Logic
    if (submissionAvailabilityCode !== 'UPDATED') {
      const duplicateBegin = await this.repository.findOneBy({
        beginDate,
        monitorPlanComment: monitoringPlanComment
      });

      if (duplicateBegin && duplicateBegin.id !== excludeCommentId) {
        return CheckCatalogService.formatResultMessage('MONPLAN-3-A', {
          fieldnames: 'monitoringPlanComment, beginDate',
          recordtype: KEY
        });
      }

      if (endDate) {
        const duplicateEnd = await this.repository.findOneBy({
          monitorPlanComment: monitoringPlanComment,
          endDate
        });

        if (duplicateEnd && duplicateEnd.id !== excludeCommentId) {
          return CheckCatalogService.formatResultMessage('MONPLAN-3-A', {
            fieldnames: 'monitoringPlanComment, endDate',
            recordtype: KEY
          });
        }
      }
    } else {
      return CheckCatalogService.formatResultMessage('MONPLAN-3-B', {
        key: KEY
      });
    }

    return null;
  }

  async getComments(planId: string): Promise<MonitorPlanCommentDTO[]> {
    const results = await this.repository.findBy({ monitorPlanId: planId });
    return this.map.many(results);
  }

  async getCommentById(commentId: string): Promise<MonitorPlanCommentDTO> {
    const result = await this.repository.findOneBy({ id: commentId });
    return this.map.one(result);
  }

  async getCommentsByPlanIdCommentBD(
    planId: string,
    planComment: string,
    beginDate: Date,
    trx?: EntityManager,
  ): Promise<MonitorPlanCommentDTO> {
    const result = await withTransaction(this.repository, trx).findOne({
      where: {
        monitorPlanId: planId,
        monitorPlanComment: planComment,
        beginDate: beginDate,
      },
    });

    if (result) return this.map.one(result);
    else return null;
  }

  async createComment(
    monPlanId: string,
    payload: MonitorPlanCommentBaseDTO,
    userId: string,
    trx?: EntityManager,
    isImport: boolean = false
  ): Promise<MonitorPlanCommentDTO> {
    const repository = withTransaction(this.repository, trx);

    const comment = repository.create({
      id: v4(),
      monitorPlanId: monPlanId,
      monitorPlanComment: payload.monitoringPlanComment,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });
    const result = await repository.save(comment);

    if (!isImport) {
      const monitorPlanWorkspaceRepository = withTransaction(this.monitorPlanWorkspaceRepository, trx);
      await monitorPlanWorkspaceRepository.resetToNeedsEvaluation(monPlanId, userId)
    }

    return this.map.one(result);
  }

  async updateComment(
    monPlanId: string,
    payload: MonitorPlanCommentBaseDTO,
    userId: string,
    monitorPlanCommentId: string,
    trx?: EntityManager,
    isImport: boolean = false
  ): Promise<MonitorPlanCommentDTO> {
    const repository = withTransaction(this.repository, trx);

    const comment = await repository.findOne({
      where: {
        monitorPlanId: monPlanId,
        id: monitorPlanCommentId
      },
    });

    comment.monitorPlanComment = payload.monitoringPlanComment,
      comment.beginDate = payload.beginDate,
      comment.endDate = payload.endDate;
    comment.userId = userId;
    comment.updateDate = currentDateTime();
    const result = await repository.save(comment);

    if (!isImport) {
      const monitorPlanWorkspaceRepository = withTransaction(this.monitorPlanWorkspaceRepository, trx);
      await monitorPlanWorkspaceRepository.resetToNeedsEvaluation(monPlanId, userId)
    }
    return this.map.one(result);
  }

  async importComments(
    commentData: MonitorPlanCommentBaseDTO[],
    locationIds: string[],
    userId: string,
    trx?: EntityManager,
  ) {
    return settlePromises(
      commentData.map(async (comment) => {
        const res = await this.entityManager.query(
          'select * from camdecmpswks.get_plan_by_comment_begin_and_end_date($1,$2,$3)',
          [locationIds, comment.beginDate, comment.endDate],
        );
        const planIds = res.map((row) => row.mon_plan_id);
        await settlePromises(
          planIds.map(async (id) => {
            const monitorPlanComment = await this.getCommentsByPlanIdCommentBD(
              id,
              comment.monitoringPlanComment,
              comment.beginDate,
              trx,
            );
            if (!monitorPlanComment) {
              await this.createComment(id, comment, userId, trx, true);
            } else {
              if (
                monitorPlanComment.endDate !== comment.endDate ||
                monitorPlanComment.beginDate !== comment.beginDate ||
                monitorPlanComment.monitoringPlanComment !==
                comment.monitoringPlanComment
              ) {
                await this.updateComment(
                  id,
                  comment,
                  userId,
                  monitorPlanComment.id,
                  trx,
                  true,
                );
              }
            }
          }),
        );
      }),
    );
  }
}
