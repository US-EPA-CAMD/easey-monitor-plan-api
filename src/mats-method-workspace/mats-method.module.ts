import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMethodController } from './mats-method.controller';
import { MatsMethodService } from './mats-method.service';
import { MatsMethodRepository } from './mats-method.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatsMethodRepository])],
  controllers: [MatsMethodController],
  providers: [MatsMethodService],
})
export class MatsMethodWorkspaceModule {}
