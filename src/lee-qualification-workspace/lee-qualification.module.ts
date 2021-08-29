import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LEEQualificationWorkspaceController } from './lee-qualification.controller';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualificationMap } from '../maps/lee-qualification.map';

@Module({
  imports: [TypeOrmModule.forFeature([LEEQualificationWorkspaceRepository])],
  controllers: [LEEQualificationWorkspaceController],
  providers: [LEEQualificationWorkspaceService, LEEQualificationMap],
  exports: [
    TypeOrmModule,
    LEEQualificationWorkspaceService,
    LEEQualificationMap,
  ],
})
export class LEEQualificationWorkspaceModule {}
