import { EntityRepository, Repository } from 'typeorm';

import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';

@EntityRepository(UnitStackConfiguration)
export class UnitStackConfigurationWorkspaceRepository extends Repository<
  UnitStackConfiguration
> {
  async getUnitStackById(id: string) {
    return this.createQueryBuilder('usc')
      .where('usc.id = :id', { id })
      .getOne();
  }

  async getUnitStackByUnitIdStackIdBDate(
    unitRecordId: number,
    stackPipeRecordId: string,
    beginDate: Date,
  ): Promise<UnitStackConfiguration> {
    return this.createQueryBuilder('usc')
      .where('usc.unitId = :unitRecordId', { unitRecordId })
      .andWhere('usc.stackPipeId = :stackPipeRecordId', { stackPipeRecordId })
      .andWhere('usc.beginDate = :beginDate', { beginDate })
      .getOne();
  }

  async getUnitStackConfigsByLocationIds(locationIds: string[]) {
    return this.createQueryBuilder('usc')
      .innerJoin('usc.unit', 'u')
      .innerJoin('usc.stackPipe', 'sp')
      .innerJoin('u.location', 'mlu')
      .innerJoin('sp.location', 'mlsp')
      .where('mlu.id IN (:...locationIds)', { locationIds })
      .andWhere('mlsp.id IN (:...locationIds)', { locationIds })
      .getMany();
  }

  // async getUnitStackConfigsByLocationIds(locationIds: string[]) {
  //   return await this.query(
  //     `
  //   SELECT u.unitid, sp.stack_name, usc.*
  //   FROM camdecmpswks.unit_stack_configuration usc
  //   JOIN camdecmpswks.stack_pipe sp using(stack_pipe_id)
  //   JOIN camd.unit u using(unit_id)
  //   JOIN camdecmpswks.monitor_location mlu
  //   ON usc.unit_id = mlu.unit_id
  //   JOIN camdecmps.monitor_location mlsp
  //   ON usc.stack_pipe_id = mlsp.stack_pipe_id
  //   WHERE mlu.mon_loc_id in ($1)
  //   AND mlsp.mon_loc_id in ($1)`,
  //     [locationIds],
  //   );
  // }
}
