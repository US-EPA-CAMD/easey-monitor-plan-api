import { Test, TestingModule } from '@nestjs/testing';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadService } from './monitor-load.service';
import { MonitorLoadController } from './monitor-load.controller';

jest.mock('./monitor-load.service');

const locId = 'some location id';

const data: MonitorLoadDTO[] = [];
data.push(new MonitorLoadDTO());
data.push(new MonitorLoadDTO());

describe('MonitorLoadController', () => {
  let controller: MonitorLoadController;
  let service: MonitorLoadService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorLoadController],
      providers: [MonitorLoadService],
    }).compile();

    controller = module.get(MonitorLoadController);
    service = module.get(MonitorLoadService);
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
