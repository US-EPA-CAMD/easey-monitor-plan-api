import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanParamsDTO } from './dto/monitor-plan-params.dto';
import { MonitorPlanDTO } from './dto/monitor-plan.dto';

import { Request } from 'express';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private monitorPlanRepository: MonitorPlanRepository,
  ) {}

  getMonitorPlan(
    monitorPlanParamsDTO: MonitorPlanParamsDTO,
    req: Request,
  ): MonitorPlanDTO[] {
    const {
      page,
      perPage,
      orisCode,
      facId,
      orderBy,
      active,
    } = monitorPlanParamsDTO;

    let monitorPlans = this.monitorPlanRepository.getMonitorPlan(
      monitorPlanParamsDTO,
    );

    if (page && perPage) {
      const totalCount = monitorPlans.length;
      const totalPages: number = Math.ceil(monitorPlans.length / +perPage);

      const pageNum: number = +page;
      const perPageNum: number = +perPage;

      const begin: number = (pageNum - 1) * perPageNum;
      const end: number = begin + perPageNum;

      monitorPlans = monitorPlans.slice(begin, end);

      if (+totalPages > +1) {
        let linkList = [
          `</monitor-plans?page=1&perPage=${perPage}`,
          `</monitor-plans?page=${+page - 1}&perPage=${perPage}`,
          `</monitor-plans?page=${+page + 1}&perPage=${perPage}`,
          `</monitor-plans?page=${totalPages}&perPage=${perPage}`,
        ];

        if (orderBy) {
          for (const index in linkList) {
            linkList[index] = linkList[index] + `&orderBy=${orderBy}`;
          }
        }

        if (facId) {
          for (const index in linkList) {
            linkList[index] = linkList[index] + `&facId=${facId}`;
          }
        }

        if (orisCode) {
          for (const index in linkList) {
            linkList[index] = linkList[index] + `&orisCode=${orisCode}`;
          }
        }

        if (active) {
          for (const index in linkList) {
            linkList[index] = linkList[index] + `&active=${active}`;
          }
        }

        linkList[0] = linkList[0] + '>; rel="first"';
        linkList[1] = linkList[1] + '>; rel="prev"';
        linkList[2] = linkList[2] + '>; rel="next"';
        linkList[3] = linkList[3] + '>; rel="last"';

        let responseLinks: string;

        switch (+page) {
          case 1: {
            responseLinks = linkList[2] + ',' + linkList[3];
            break;
          }
          case totalPages: {
            responseLinks = linkList[0] + ',' + linkList[1];
            break;
          }
          default: {
            responseLinks =
              linkList[0] +
              ',' +
              linkList[1] +
              ',' +
              linkList[2] +
              ',' +
              linkList[3];
            break;
          }
        }

        req.res.setHeader('Link', responseLinks);
        req.res.setHeader('X-Total-Count', totalCount);
      }
    }

    return monitorPlans;
  }
}
