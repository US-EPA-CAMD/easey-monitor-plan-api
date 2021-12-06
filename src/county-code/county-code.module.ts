import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountyCodeService } from './county-code.service';
import { CountyCodeController } from './county-code.controller';
import { CountyCodeRepository } from './county-code.repository';
import { CountyCodeMap } from '../maps/county-code.map';

@Module({
  imports: [TypeOrmModule.forFeature([CountyCodeRepository])],
  controllers: [CountyCodeController],
  providers: [CountyCodeService, CountyCodeMap],
  exports: [TypeOrmModule, CountyCodeService, CountyCodeMap],
})
export class CountyCodeModule {}
