import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';

interface CheckOptions {
  checkName: string;
  checkDescription: string;
}

export class CheckResult {
  public checkResult = true;

  private checkErrorMessages = [];
  private import: string;

  constructor(importName: string) {
    this.import = importName;
  }

  public addError(severity: string, message: string) {
    this.checkResult = false;
    this.checkErrorMessages.push(`[${this.import}-${severity}] ${message}`);
  }
}

export class Check {
  public checkName: string;
  public checkDescription: string;

  private func: Function;

  constructor(options: CheckOptions, checkFunc: Function) {
    this.checkName = options.checkName;
    this.checkDescription = options.checkDescription;

    this.func = checkFunc;
  }

  public async executeCheck(
    monitorPlan: UpdateMonitorPlanDTO,
  ): Promise<CheckResult> {
    return this.func(monitorPlan);
  }
}
