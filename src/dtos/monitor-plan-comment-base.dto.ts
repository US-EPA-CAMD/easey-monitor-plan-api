import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
export class MonitorPlanCommentBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.description,
    example:
      propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.example,
    name:
      propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.fieldLabels
        .value,
  })
  @MinLength(1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLANCOMMENT-FATAL-A] The value : ${args.value} for ${args.property} must exceed 1 character`;
    },
  })
  @MaxLength(4000, {
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLANCOMMENT-FATAL-A] The value : ${args.value} for ${args.property} must not exceed 4000 characters`;
    },
  })
  monitoringPlanComment: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOBeginDate.description,
    example: propertyMetadata.monitorPlanCommentDTOBeginDate.example,
    name: propertyMetadata.monitorPlanCommentDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLANCOMMENT-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOEndDate.description,
    example: propertyMetadata.monitorPlanCommentDTOEndDate.example,
    name: propertyMetadata.monitorPlanCommentDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLANCOMMENT-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endDate: Date;
}
