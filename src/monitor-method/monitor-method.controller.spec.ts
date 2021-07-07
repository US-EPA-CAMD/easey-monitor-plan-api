import { Test, TestingModule } from '@nestjs/testing';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodService } from './monitor-method.service';
import { MonitorMethodController } from './monitor-method.controller';

jest.mock('./monitor-method.service');

const locId = 'some location id';

const data: MonitorMethodDTO[] = [];
data.push(new MonitorMethodDTO());
data.push(new MonitorMethodDTO());

describe('MonitorMethodController', () => {
  let controller: MonitorMethodController;
  let service: MonitorMethodService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorMethodController],
      providers: [MonitorMethodService],
    }).compile();

    controller = module.get(MonitorMethodController);
    service = module.get(MonitorMethodService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMethods', () => {
    it('should return array of monitor methods', async () => {
      jest.spyOn(service, 'getMethods').mockResolvedValue(data);
      expect(await controller.getMethods(locId)).toBe(data);
    });
  });
});
