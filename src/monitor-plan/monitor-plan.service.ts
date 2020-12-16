import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanParamsDTO } from '../dtos/monitor-plan-params.dto';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private repository: MonitorPlanRepository,
    private map: MonitorPlanMap
  ) {}

  async getMonitorPlans(
    paramsDTO: MonitorPlanParamsDTO,
  ): Promise<MonitorPlanDTO[]> {
    const results = await this.repository.getMonitorPlans(paramsDTO);
    return this.map.many(results);

    // if (page && perPage) {
    //   const totalCount = monitorPlans.length;
    //   const totalPages: number = Math.ceil(monitorPlans.length / +perPage);

    //   const pageNum: number = +page;
    //   const perPageNum: number = +perPage;

    //   const begin: number = (pageNum - 1) * perPageNum;
    //   const end: number = begin + perPageNum;

    //   monitorPlans = monitorPlans.slice(begin, end);

    //   if (+totalPages > +1) {
    //     let linkList = [
    //       `</monitor-plans?page=1&perPage=${perPage}`,
    //       `</monitor-plans?page=${+page - 1}&perPage=${perPage}`,
    //       `</monitor-plans?page=${+page + 1}&perPage=${perPage}`,
    //       `</monitor-plans?page=${totalPages}&perPage=${perPage}`,
    //     ];

    //     if (orderBy) {
    //       for (const index in linkList) {
    //         linkList[index] = linkList[index] + `&orderBy=${orderBy}`;
    //       }
    //     }

    //     if (facId) {
    //       for (const index in linkList) {
    //         linkList[index] = linkList[index] + `&facId=${facId}`;
    //       }
    //     }

    //     if (orisCode) {
    //       for (const index in linkList) {
    //         linkList[index] = linkList[index] + `&orisCode=${orisCode}`;
    //       }
    //     }

    //     if (active) {
    //       for (const index in linkList) {
    //         linkList[index] = linkList[index] + `&active=${active}`;
    //       }
    //     }

    //     linkList[0] = linkList[0] + '>; rel="first"';
    //     linkList[1] = linkList[1] + '>; rel="prev"';
    //     linkList[2] = linkList[2] + '>; rel="next"';
    //     linkList[3] = linkList[3] + '>; rel="last"';

    //     let responseLinks: string;

    //     switch (+page) {
    //       case 1: {
    //         responseLinks = linkList[2] + ',' + linkList[3];
    //         break;
    //       }
    //       case totalPages: {
    //         responseLinks = linkList[0] + ',' + linkList[1];
    //         break;
    //       }
    //       default: {
    //         responseLinks =
    //           linkList[0] +
    //           ',' +
    //           linkList[1] +
    //           ',' +
    //           linkList[2] +
    //           ',' +
    //           linkList[3];
    //         break;
    //       }
    //     }

    //     req.res.setHeader('Link', responseLinks);
    //     req.res.setHeader('X-Total-Count', totalCount);
    //   }
    // }

    // return monitorPlans;
  }
}
