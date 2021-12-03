import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MonitorPlanReportResult } from "../entities/vw-monitor-plan-report-results.entity";

@Injectable()
export class MonitorPlanReportResultService {
  constructor(
    @InjectRepository(MonitorPlanReportResult)
    private readonly repository: MonitorPlanReportResult
  ) {}
}