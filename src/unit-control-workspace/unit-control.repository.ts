import { EntityRepository, Repository } from 'typeorm';
import { UnitControl } from '../entities/workspace/unit-control.entity';

@EntityRepository(UnitControl)
export class UnitControlWorkspaceRepository extends Repository<UnitControl> {
  async getUnitControls(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitControl[]> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .getMany();
  }
  async getUnitControl(unitControlId: string): Promise<UnitControl> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .where('uc.id = :unitControlId', { unitControlId })
      .getOne();
  }

  async getUnitControlByUnitIdParamCdControlCd(
    unitRecordId: number,
    parameterCode: string,
    controlCode: string,
    installDate: Date,
    retireDate: Date,
  ): Promise<UnitControl> {
    return this.createQueryBuilder('uc')
      .where('uc.unitId = :unitRecordId', {
        unitRecordId,
      })
      .andWhere('uc.parameterCode = :parameterCode', {
        parameterCode,
      })
      .andWhere('uc.controlCode = :controlCode', { controlCode })
      .andWhere(
        '(uc.installDate = :installDate) OR (uc.retireDate = :retireDate)',
        { installDate, retireDate },
      )
      .getOne();
  }
}
