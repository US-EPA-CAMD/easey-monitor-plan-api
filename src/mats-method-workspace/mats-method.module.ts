import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMethodWorkspaceController } from './mats-method.controller';
import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatsMethodWorkspaceRepository])],
  controllers: [MatsMethodWorkspaceController],
  providers: [MatsMethodWorkspaceService],
})
export class MatsMethodWorkspaceModule {}
