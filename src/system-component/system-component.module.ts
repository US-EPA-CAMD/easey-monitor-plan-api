import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentModule } from '../component/component.module';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentController } from './system-component.controller';
import { SystemComponentRepository } from './system-component.repository';
import { SystemComponentService } from './system-component.service';

@Module({
  imports: [
    ComponentModule,
    TypeOrmModule.forFeature([SystemComponentRepository]),
  ],
  controllers: [SystemComponentController],
  providers: [
    SystemComponentRepository,
    SystemComponentService,
    SystemComponentMap,
  ],
  exports: [
    TypeOrmModule,
    SystemComponentRepository,
    SystemComponentService,
    SystemComponentMap,
  ],
})
export class SystemComponentModule {}
