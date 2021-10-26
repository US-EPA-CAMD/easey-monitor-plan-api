import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowWorkspaceController } from './system-fuel-flow.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

jest.mock('./system-fuel-flow.service');

const locId = 'some location id';
const sysId = 'some system id';

const data: SystemFuelFlowDTO[] = [];
data.push(new SystemFuelFlowDTO());
data.push(new SystemFuelFlowDTO());

describe('SystemFuelFlowController', () => {
  let controller: SystemFuelFlowWorkspaceController;
  let service: SystemFuelFlowWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [SystemFuelFlowWorkspaceController],
      providers: [SystemFuelFlowWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(SystemFuelFlowWorkspaceController);
    service = module.get(SystemFuelFlowWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFuelFlows', () => {
    it('should return array of system fuel flows', async () => {
      jest.spyOn(service, 'getFuelFlows').mockResolvedValue(data);
      expect(await controller.getFuelFlows(locId, sysId)).toBe(data);
    });
  });
});
