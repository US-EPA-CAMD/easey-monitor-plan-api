import { Test, TestingModule } from '@nestjs/testing';

import { DuctWafWorkspaceController } from './duct-waf.controller';
import { DuctWafWorkspaceService } from './duct-waf.service';

jest.mock('./duct-waf.service');

describe('DuctWafWorkspaceController', () => {
  let controller: DuctWafWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DuctWafWorkspaceController],
      providers: [DuctWafWorkspaceService],
    }).compile();

    controller = module.get<DuctWafWorkspaceController>(
      DuctWafWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
