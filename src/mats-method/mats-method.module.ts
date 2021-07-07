import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMethodController } from './mats-method.controller';
import { MatsMethodService } from './mats-method.service';
import { MatsMethodRepository } from './mats-method.repository';

import { MatsMethodMap } from '../maps/mats-method.map';

@Module({
  imports: [TypeOrmModule.forFeature([MatsMethodRepository])],
  controllers: [MatsMethodController],
  providers: [MatsMethodMap, MatsMethodService],
})
export class MatsMethodModule {}
