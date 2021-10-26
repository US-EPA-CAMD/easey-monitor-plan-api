import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DuctWafWorkspaceController } from './duct-waf.controller';
import { DuctWafWorkspaceService } from './duct-waf.service';

jest.mock('./duct-waf.service');

describe('DuctWafWorkspaceController', () => {
  let controller: DuctWafWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [DuctWafWorkspaceController],
      providers: [DuctWafWorkspaceService, ConfigService],
    }).compile();

    controller = module.get<DuctWafWorkspaceController>(
      DuctWafWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
