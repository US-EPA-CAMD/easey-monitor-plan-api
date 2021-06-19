import { Repository, EntityRepository } from 'typeorm';
import { MonitorMethodDTO } from 'src/dtos/monitor-method.dto';

import { MonitorMethod } from '../entities/workspace/monitor-method.entity';

@EntityRepository(MonitorMethod)
export class MonitorMethodWorkspaceRepository extends Repository<
  MonitorMethod
> {
  async createUpadteMethod(createMethodDTO: MonitorMethodDTO) {
    const {
      monLocId,
      parameterCode,
      methodCode,
      subDataCode,
      bypassApproachCode,
      beginDate,
      beginHour,
      endDate,
      endHour,
    } = createMethodDTO;

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
    });

    await this.save(monMethod);

    return monMethod;
  }
}
