import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodController } from './mats-method.controller';
import { MatsMethodRepository } from './mats-method.repository';
import { MatsMethodService } from './mats-method.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatsMethodRepository])],
  controllers: [MatsMethodController],
  providers: [MatsMethodRepository, MatsMethodService, MatsMethodMap],
  exports: [
    TypeOrmModule,
    MatsMethodRepository,
    MatsMethodService,
    MatsMethodMap,
  ],
})
export class MatsMethodModule {}
