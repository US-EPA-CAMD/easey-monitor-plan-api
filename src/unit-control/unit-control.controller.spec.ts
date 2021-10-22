import { Test, TestingModule } from '@nestjs/testing';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlController } from './unit-control.controller';
import { UnitControlService } from './unit-control.service';

jest.mock('./unit-control.service');

const locId = '6';
const unitRecordId = 1;

const data: UnitControlDTO[] = [];
data.push(new UnitControlDTO());
data.push(new UnitControlDTO());

describe('UnitControlController', () => {
  let controller: UnitControlController;
  let service: UnitControlService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitControlController],
      providers: [UnitControlService],
    }).compile();

    controller = module.get(UnitControlController);
    service = module.get(UnitControlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitControls', () => {
    it('should return array of unit controls', async () => {
      jest.spyOn(service, 'getUnitControls').mockResolvedValue(data);
      expect(await controller.getUnitControls(locId, unitRecordId)).toBe(data);
    });
  });
});
