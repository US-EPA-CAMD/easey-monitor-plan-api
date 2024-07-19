import { Injectable } from '@nestjs/common';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 } from 'uuid';

import { withTransaction } from '../utils';
import {
  MonitorPlanCommentBaseDTO,
  MonitorPlanCommentDTO,
} from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';

@Injectable()
export class MonitorPlanCommentWorkspaceService {
  constructor(
    private readonly repository: MonitorPlanCommentWorkspaceRepository,
    private readonly map: MonitorPlanCommentMap,
  ) {}

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
    return this.map.one(result);
  }

  async updateComment(
    monPlanId: string,
    payload: MonitorPlanCommentBaseDTO,
    userId: string,
    trx?: EntityManager,
  ): Promise<MonitorPlanCommentDTO> {
    const repository = withTransaction(this.repository, trx);

    const comment = await repository.findOne({
      where: {
        monitorPlanId: monPlanId,
        monitorPlanComment: payload.monitoringPlanComment,
        beginDate: payload.beginDate,
      },
    });

    comment.endDate = payload.endDate;
    comment.userId = userId;
    comment.updateDate = currentDateTime();
    const result = await repository.save(comment);
    return this.map.one(result);
  }

  async importComments(
    commentData: MonitorPlanCommentBaseDTO[],
    userId: string,
    monitorPlanId: string,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const comment of commentData) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const monitorPlanComment = await this.getCommentsByPlanIdCommentBD(
                  monitorPlanId,
                  comment.monitoringPlanComment,
                  comment.beginDate,
                  trx,
                );

                if (!monitorPlanComment) {
                  await this.createComment(monitorPlanId, comment, userId, trx);
                } else {
                  if (monitorPlanComment.endDate !== comment.endDate) {
                    await this.updateComment(
                      monitorPlanId,
                      comment,
                      userId,
                      trx,
                    );
                  }
                }
                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })();
    });
  }
}
