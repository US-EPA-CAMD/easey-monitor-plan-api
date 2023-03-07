import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemComponentMasterDataRelationshipRepository } from './system-component-master-data-relationship.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemComponentMasterDataRelationshipRepository]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class SystemComponentMasterDataRelationshipModule {}
