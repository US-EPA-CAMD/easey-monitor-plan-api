import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PCTQualificationWorkspaceController } from './pct-qualification.controller';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualificationMap } from '../maps/pct-qualification.map';

@Module({
  imports: [TypeOrmModule.forFeature([PCTQualificationWorkspaceRepository])],
  controllers: [PCTQualificationWorkspaceController],
  providers: [PCTQualificationWorkspaceService, PCTQualificationMap],
  exports: [
    TypeOrmModule,
    PCTQualificationWorkspaceService,
    PCTQualificationMap,
  ],
})
export class PCTQualificationWorkspaceModule {}
