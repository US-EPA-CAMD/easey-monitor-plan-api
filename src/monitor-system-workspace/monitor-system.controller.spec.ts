import { Test, TestingModule } from '@nestjs/testing';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemWorkspaceController } from './monitor-system.controller';

jest.mock('./monitor-system.service');

const locId = 'some location id';

const data: MonitorSystemDTO[] = [];
data.push(new MonitorSystemDTO());
data.push(new MonitorSystemDTO());

describe('MonitorSystemWorkspaceController', () => {
  let controller: MonitorSystemWorkspaceController;
  let service: MonitorSystemWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorSystemWorkspaceController],
      providers: [MonitorSystemWorkspaceService],
    }).compile();

    controller = module.get(MonitorSystemWorkspaceController);
    service = module.get(MonitorSystemWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSystems', () => {
    it('should return array of monitor systems', async () => {
      jest.spyOn(service, 'getSystems').mockResolvedValue(data);
      expect(await controller.getSystems(locId)).toBe(data);
    });
  });
});
