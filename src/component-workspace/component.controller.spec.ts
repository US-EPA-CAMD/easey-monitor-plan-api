import { Test, TestingModule } from '@nestjs/testing';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentWorkspaceService } from './component.service';
import { ComponentWorkspaceController } from './component.controller';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

jest.mock('./component.service');

const locId = 'some location id';

const data: ComponentDTO[] = [];
data.push(new ComponentDTO());
data.push(new ComponentDTO());

describe('ComponentWorkspaceController', () => {
  let controller: ComponentWorkspaceController;
  let service: ComponentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [ComponentWorkspaceController],
      providers: [ComponentWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(ComponentWorkspaceController);
    service = module.get(ComponentWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of components', async () => {
      jest.spyOn(service, 'getComponents').mockResolvedValue(data);
      expect(await controller.getComponents(locId)).toBe(data);
    });
  });
});
