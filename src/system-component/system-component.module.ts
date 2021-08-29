import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemComponentController } from './system-component.controller';
import { SystemComponentService } from './system-component.service';
import { SystemComponentRepository } from './system-component.repository';
import { SystemComponentMap } from '../maps/system-component.map';

@Module({
  imports: [TypeOrmModule.forFeature([SystemComponentRepository])],
  controllers: [SystemComponentController],
  providers: [SystemComponentService, SystemComponentMap],
  exports: [TypeOrmModule, SystemComponentService, SystemComponentMap],
})
export class SystemComponentModule {}
