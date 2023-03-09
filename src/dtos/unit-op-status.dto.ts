import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UnitOpStatusDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  unitId: number;

  @IsString()
  opStatusCode: string;

  @IsDateString()
  beginDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;
}
