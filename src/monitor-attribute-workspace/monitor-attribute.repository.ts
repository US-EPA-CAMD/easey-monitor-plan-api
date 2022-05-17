import { MonitorAttributeBaseDTO } from 'src/dtos/monitor-attribute.dto';
import { EntityRepository, Repository } from 'typeorm';

import { MonitorAttribute } from '../entities/workspace/monitor-attribute.entity';

@EntityRepository(MonitorAttribute)
export class MonitorAttributeWorkspaceRepository extends Repository<
  MonitorAttribute
> {
  async getAttribute(
    locationId: string,
    id: string,
  ): Promise<MonitorAttribute> {
    return this.createQueryBuilder('ma')
      .where('ma.locationId = :locationId', { locationId })
      .andWhere('ma.id = :id', { id })
      .getOne();
  }

  async getAttributeByLocIdAndDate(
    locationId: string,
    attribute: MonitorAttributeBaseDTO,
  ): Promise<MonitorAttribute> {
    const beginDate = attribute.beginDate;
    const endDate = attribute.endDate;

    return this.createQueryBuilder('ma')
      .where('ma.locationId = :locationId', {
        locationId,
      })
      .andWhere('ma.beginDate = :beginDate OR ma.endDate = :endDate', {
        beginDate,
        endDate,
      })
      .getOne();
  }
}
