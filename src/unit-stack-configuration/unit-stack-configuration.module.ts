import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitStackConfigurationController } from './unit-stack-configuration.controller';
import { UnitStackConfigurationService } from './unit-stack-configuration.service';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';

@Module({
  imports: [TypeOrmModule.forFeature([UnitStackConfigurationRepository])],
  controllers: [UnitStackConfigurationController],
  providers: [UnitStackConfigurationService, UnitStackConfigurationMap],
  exports: [
    TypeOrmModule,
    UnitStackConfigurationService,
    UnitStackConfigurationMap,
  ],
})
export class UnitStackConfigurationModule {}
