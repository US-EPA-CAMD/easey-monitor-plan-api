import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';

import {
  MonitorPlanCommentBaseDTO,
  MonitorPlanCommentDTO,
} from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';
import { v4 } from 'uuid';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class MonitorPlanCommentWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanCommentWorkspaceRepository)
    private readonly repository: MonitorPlanCommentWorkspaceRepository,
    private readonly map: MonitorPlanCommentMap,
  ) {}

  async getComments(planId: string): Promise<MonitorPlanCommentDTO[]> {
    const results = await this.repository.find({ monitorPlanId: planId });
    return this.map.many(results);
  }

  async getCommentById(commentId: string): Promise<MonitorPlanCommentDTO> {
    const result = await this.repository.findOne({ id: commentId });
    return this.map.one(result);
  }

  async getCommentsByPlanIdCommentBD(
    planId: string,
    planComment: string,
    beginDate: Date,
  ): Promise<MonitorPlanCommentDTO> {
    const result = await this.repository.findOne({
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
  ): Promise<MonitorPlanCommentDTO> {
    const comment = this.repository.create({
      id: v4(),
      monitorPlanId: monPlanId,
      monitorPlanComment: payload.monitoringPlanComment,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });
    const result = await this.repository.save(comment);
    return this.map.one(result);
  }

  async updateComment(
    monPlanId: string,
    payload: MonitorPlanCommentBaseDTO,
    userId: string,
  ): Promise<MonitorPlanCommentDTO> {
    const comment = await this.repository.findOne({
      where: {
        monitorPlanId: monPlanId,
        monitorPlanComment: payload.monitoringPlanComment,
        beginDate: payload.beginDate,
      },
    });

    comment.endDate = payload.endDate;
    comment.userId = userId;
    comment.updateDate = currentDateTime();
    const result = await this.repository.save(comment);
    return this.map.one(result);
  }

  async importComments(
    plan: UpdateMonitorPlanDTO,
    userId: string,
    monitorPlanId: string,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const comment of plan.monitoringPlanCommentData) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const monitorPlanComment = await this.getCommentsByPlanIdCommentBD(
                  monitorPlanId,
                  comment.monitoringPlanComment,
                  comment.beginDate,
                );

                if (!monitorPlanComment) {
                  await this.createComment(monitorPlanId, comment, userId);
                } else {
                  if (monitorPlanComment.endDate !== comment.endDate) {
                    await this.updateComment(monitorPlanId, comment, userId);
                  }
                }
                innerResolve(true);
              })()
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })()
    });
  }
}
