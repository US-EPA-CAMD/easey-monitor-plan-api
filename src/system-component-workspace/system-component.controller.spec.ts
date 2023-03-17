import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentWorkspaceService } from './system-component.service';
import { SystemComponentWorkspaceController } from './system-component.controller';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';

jest.mock('./system-component.service');

const locId = 'some location id';
const sysId = 'some system id';

const data: SystemComponentDTO[] = [];
data.push(new SystemComponentDTO());
data.push(new SystemComponentDTO());

describe('SystemComponentWorkspaceController', () => {
  let controller: SystemComponentWorkspaceController;
  let service: SystemComponentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [SystemComponentWorkspaceController],
      providers: [
        SystemComponentWorkspaceService,
        ConfigService,
        {
          provide: ComponentCheckService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: () => ({
            getComponentByLocIdAndCompId: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    controller = module.get(SystemComponentWorkspaceController);
    service = module.get(SystemComponentWorkspaceService);
  });

  describe('getComponents', () => {
    it('should return array of system components', async () => {
      jest.spyOn(service, 'getSystemComponents').mockResolvedValue(data);
      expect(await controller.getSystemComponents(locId, sysId)).toBe(data);
    });
  });
});
