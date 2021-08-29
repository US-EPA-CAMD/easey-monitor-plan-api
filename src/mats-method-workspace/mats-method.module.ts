import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMethodWorkspaceController } from './mats-method.controller';
import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethodMap } from '../maps/mats-method.map';

@Module({
  imports: [TypeOrmModule.forFeature([MatsMethodWorkspaceRepository])],
  controllers: [MatsMethodWorkspaceController],
  providers: [MatsMethodWorkspaceService, MatsMethodMap],
  exports: [TypeOrmModule, MatsMethodWorkspaceService, MatsMethodMap],
})
export class MatsMethodWorkspaceModule {}
