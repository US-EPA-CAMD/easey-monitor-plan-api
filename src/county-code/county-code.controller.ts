import { Controller } from '@nestjs/common';
import { CountyCodeService } from './county-code.service';

@Controller()
export class CountyCodeController {
  constructor(private readonly service: CountyCodeService) {}
}
