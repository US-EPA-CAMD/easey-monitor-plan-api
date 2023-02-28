import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ConfigurationMultipleParamsDTO {
  @ApiProperty({
    isArray: true,
    description: 'Array of oris codes',
  })
  @Transform(({ value }) =>
    value.split('|').map((item: string) => parseInt(item.trim())),
  )
  orisCodes: number[];

  @ApiProperty({
    isArray: true,
    description: 'Array of configurations',
  })
  @ApiPropertyOptional()
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  monPlanIds: string[];
}