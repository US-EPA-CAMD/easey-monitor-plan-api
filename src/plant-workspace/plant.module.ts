import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlantWorkspaceRepository } from './plant.repository';
import { PlantWorkspaceService } from './plant.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlantWorkspaceRepository])],
  providers: [PlantWorkspaceRepository, PlantWorkspaceService],
  exports: [TypeOrmModule, PlantWorkspaceRepository, PlantWorkspaceService],
})
export class PlantWorkspaceModule {}
