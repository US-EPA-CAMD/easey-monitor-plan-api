import { Test, TestingModule } from '@nestjs/testing';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationController } from './monitor-location.controller';
import { MonitorLocationService } from './monitor-location.service';

jest.mock('./monitor-location.service');

const locId = '6';
const returnedLoc = new MonitorLocationDTO();

describe('MonitorLocationController', () => {
  let controller: MonitorLocationController;
  let service: MonitorLocationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorLocationController],
      providers: [MonitorLocationService],
    }).compile();

    controller = module.get(MonitorLocationController);
    service = module.get(MonitorLocationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLocation', () => {
    it('should return array of monitor loads', async () => {
      jest.spyOn(service, 'getLocation').mockResolvedValue(returnedLoc);
      expect(await controller.getLocation(locId)).toBe(returnedLoc);
    });
  });
});
