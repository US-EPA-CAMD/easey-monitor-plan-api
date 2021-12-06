import { EntityRepository, Repository } from 'typeorm';
import { CountyCode } from '../entities/county-code.entity';

@EntityRepository(CountyCode)
export class CountyCodeRepository extends Repository<CountyCode> {}
