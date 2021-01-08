import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { supplementalMethodsController } from './supplemental-methods.controller';
import { SupplementalMethodsService } from './supplemental-methods.service';
import { MatsMethodRepository } from './supplemental-methods.repository';

import { MatsMethodMap } from '../maps/mats-method-data.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsMethodRepository]),
  ],
  controllers: [supplementalMethodsController],
  providers: [
    MatsMethodMap,
    SupplementalMethodsService, 
  ],
})

export class SupplementalMethodsModule {}
