import { Repository, EntityRepository } from 'typeorm';

import { AnalyzerRange } from '../entities/analyzer-range.entity';

@EntityRepository(AnalyzerRange)
export class AnalyzerRangeRepository extends Repository<AnalyzerRange>{
   async AnalyzerRange() : Promise<AnalyzerRange[]>  {
    const components = this.createQueryBuilder("Analyzer Range") 
       return await components.getMany();
      }
}