import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { LMEQualificationWorkspaceController } from './lme-qualification.controller';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualificationMap } from '../maps/lme-qualification.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([LMEQualificationWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [LMEQualificationWorkspaceController],
  providers: [LMEQualificationWorkspaceService, LMEQualificationMap],
  exports: [
    TypeOrmModule,
    LMEQualificationWorkspaceService,
    LMEQualificationMap,
  ],
})
export class LMEQualificationWorkspaceModule {}
