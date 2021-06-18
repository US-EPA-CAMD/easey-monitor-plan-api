import { Repository, EntityRepository } from 'typeorm';

import { MonitorMethod } from '../entities/monitor-method.entity';
import { MonitorMethodDTO } from 'src/dtos/monitor-method.dto';
import { MonitorMethod as MonitorMethodWks } from 'src/entities/workspace/monitor-method.entity';

@EntityRepository(MonitorMethod)
export class MonitorMethodRepository extends Repository<MonitorMethod> {
  async createMonitorMethod(
    createMonitorMethodDTO: MonitorMethodDTO,
  ): Promise<MonitorMethod> {
    const {
      parameterCode,
      methodCode,
      subDataCode,
      bypassApproachCode,
      beginDate,
      beginHour,
      endDate,
      endHour,
      active,
    } = createMonitorMethodDTO;

    const monMethod = this.create({
      monLocId,
      parameterCode,
      methodCode,
      subDataCode,
      bypassApproachCode,
      beginDate,
      beginHour,
      endDate,
      endHour,
      active,
    });

    await this.save(monMethod);

    return monMethod;
  }
}
