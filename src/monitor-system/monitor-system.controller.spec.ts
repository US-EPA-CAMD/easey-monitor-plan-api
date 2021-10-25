import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemController } from './monitor-system.controller';

jest.mock('./monitor-system.service');

const locId = 'some location id';

const data: MonitorSystemDTO[] = [];
data.push(new MonitorSystemDTO());
data.push(new MonitorSystemDTO());

describe('MonitorSystemController', () => {
  let controller: MonitorSystemController;
  let service: MonitorSystemService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorSystemController],
      providers: [MonitorSystemService],
    }).compile();

    controller = module.get(MonitorSystemController);
    service = module.get(MonitorSystemService);
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
