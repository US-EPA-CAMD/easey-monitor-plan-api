import { Test, TestingModule } from '@nestjs/testing';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadWorkspaceController } from './monitor-load.controller';

jest.mock('./monitor-load.service');

const locId = 'some location id';

const data: MonitorLoadDTO[] = [];
data.push(new MonitorLoadDTO());

describe('MonitorLoadWorkspaceController', () => {
  let controller: MonitorLoadWorkspaceController;
  let service: MonitorLoadWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorLoadWorkspaceController],
      providers: [MonitorLoadWorkspaceService],
    }).compile();

    controller = module.get(MonitorLoadWorkspaceController);
    service = module.get(MonitorLoadWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLoads', () => {
    it('should return array of monitor loads', async () => {
      jest.spyOn(service, 'getLoads').mockResolvedValue(data);
      expect(await controller.getLoads(locId)).toBe(data);
    });
  });
});
