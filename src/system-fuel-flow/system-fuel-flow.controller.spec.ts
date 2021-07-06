import { Test, TestingModule } from '@nestjs/testing';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowService } from './system-fuel-flow.service';
import { SystemFuelFlowController } from './system-fuel-flow.controller';

jest.mock('./system-fuel-flow.service');

const locId = 'some location id';
const sysId = 'some system id';

const data: SystemFuelFlowDTO[] = [];
data.push(new SystemFuelFlowDTO());
data.push(new SystemFuelFlowDTO());

describe('SystemFuelFlowController', () => {
  let controller: SystemFuelFlowController;
  let service: SystemFuelFlowService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemFuelFlowController],
      providers: [SystemFuelFlowService],
    }).compile();

    controller = module.get(SystemFuelFlowController);
    service = module.get(SystemFuelFlowService);
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
