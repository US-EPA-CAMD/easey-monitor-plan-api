import { Controller } from '@nestjs/common';
import { CPMSQualificationService } from './cpms-qualification.service';

@Controller('cpms-qualification')
export class CPMSQualificationController {
  constructor(
    private readonly cpmsQualificationService: CPMSQualificationService,
  ) {}
}
