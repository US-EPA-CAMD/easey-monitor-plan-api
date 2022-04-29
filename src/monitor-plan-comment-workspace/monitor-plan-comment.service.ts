import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';

import {
  MonitorPlanCommentBaseDTO,
  MonitorPlanCommentDTO,
} from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';

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
        monitoringPlanComment: planComment,
        beginDate: beginDate,
      },
    });
    return this.map.one(result);
  }

  async createComment(
    monPlanId: string,
    payload: MonitorPlanCommentBaseDTO,
    userId: string,
  ): Promise<MonitorPlanCommentDTO> {
    const comment = this.repository.create({
      monitorPlanId: monPlanId,
      monitorPlanComment: payload.monitoringPlanComment,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });
    this.repository.save;
    return this.map.one(comment);
  }

  async updateComment(
    monPlanId: string,
    payload: MonitorPlanCommentBaseDTO,
    userId: string,
  ): Promise<MonitorPlanCommentDTO> {
    const comment = await this.getCommentsByPlanIdCommentBD(
      monPlanId,
      payload.monitoringPlanComment,
      payload.beginDate,
    );
    comment.endDate = payload.endDate;
    comment.userId = userId;
    comment.updateDate = new Date(Date.now());
    this.repository.save;
    return this.getCommentById(comment.id);
  }

  async createOrUpdateComments(
    plan: UpdateMonitorPlanDTO,
    userId: string,
    monitorPlanId: string,
  ): Promise<MonitorPlanCommentDTO> {
    const promises = [];

    for (const comment of plan.comments) {
      promises.push(
        new Promise(async () => {
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
        }),
      );
    }

    await Promise.all(promises);

    return null;
  }
}
