import { Repository, EntityRepository } from 'typeorm';

import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';

@EntityRepository(MonitorSystemComponent)
export class MonitorSystemComponentRepository extends Repository<
  MonitorSystemComponent
> {
  async getSystemComponents(): Promise<MonitorSystemComponent[]> {
    const components = this.createQueryBuilder('MonitorSystemComponent');
    return components.getMany();
  }
}
