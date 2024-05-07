import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountyCodeMap } from '../maps/county-code.map';
import { CountyCodeController } from './county-code.controller';
import { CountyCodeRepository } from './county-code.repository';
import { CountyCodeService } from './county-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([CountyCodeRepository])],
  controllers: [CountyCodeController],
  providers: [CountyCodeRepository, CountyCodeService, CountyCodeMap],
  exports: [TypeOrmModule, CountyCodeService, CountyCodeMap],
})
export class CountyCodeModule {}
