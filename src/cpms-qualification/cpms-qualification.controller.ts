import { Controller } from '@nestjs/common';
import { CPMSQualificationService } from './cpms-qualification.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('CPMS Qualifications')
export class CPMSQualificationController {
  constructor(
    private readonly cpmsQualificationService: CPMSQualificationService,
  ) {}
}
