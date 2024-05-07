import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationController } from './unit-stack-configuration.controller';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationService } from './unit-stack-configuration.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitStackConfigurationRepository])],
  controllers: [UnitStackConfigurationController],
  providers: [
    UnitStackConfigurationRepository,
    UnitStackConfigurationService,
    UnitStackConfigurationMap,
  ],
  exports: [
    TypeOrmModule,
    UnitStackConfigurationRepository,
    UnitStackConfigurationService,
    UnitStackConfigurationMap,
  ],
})
export class UnitStackConfigurationModule {}
