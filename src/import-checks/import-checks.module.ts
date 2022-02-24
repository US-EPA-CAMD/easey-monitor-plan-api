import { Module } from '@nestjs/common';
import { ImportChecksService } from './import-checks.service';

@Module({
  providers: [ImportChecksService],
  exports: [ImportChecksService],
})
export class ImportChecksModule {}
