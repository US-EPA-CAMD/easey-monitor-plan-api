import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantRepository } from './plant.repository';
import { PlantService } from './plant.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlantRepository])],
  providers: [PlantRepository, PlantService],
  exports: [PlantRepository, PlantService],
})
export class PlantModule {}
