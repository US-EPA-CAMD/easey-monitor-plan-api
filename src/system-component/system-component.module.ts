import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemComponentController } from './system-component.controller';
import { SystemComponentService } from './system-component.service';
import { SystemComponentRepository } from './system-component.repository';
import { SystemComponentMap } from '../maps/system-component.map';
import { ComponentModule } from '../component/component.module';

@Module({
  imports: [
    ComponentModule,
    TypeOrmModule.forFeature([SystemComponentRepository]),
  ],
  controllers: [SystemComponentController],
  providers: [SystemComponentService, SystemComponentMap],
  exports: [TypeOrmModule, SystemComponentService, SystemComponentMap],
})
export class SystemComponentModule {}
