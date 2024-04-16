import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantWorkspaceRepository } from './plant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlantWorkspaceRepository])],
  providers: [PlantWorkspaceRepository],
  exports: [PlantWorkspaceRepository],
})
export class PlantWorkspaceModule {}
