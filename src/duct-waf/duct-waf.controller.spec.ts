import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DuctWafController } from './duct-waf.controller';
import { DuctWafService } from './duct-waf.service';

jest.mock('./duct-waf.service');

describe('DuctWafController', () => {
  let controller: DuctWafController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [DuctWafController],
      providers: [DuctWafService],
    }).compile();

    controller = module.get<DuctWafController>(DuctWafController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
