import { Controller } from '@nestjs/common';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('CPMS Qualifications')
export class CPMSQualificationWorkspaceController {
  constructor(
    private readonly cpmsQualificationWorkspaceService: CPMSQualificationWorkspaceService,
  ) {}
}
