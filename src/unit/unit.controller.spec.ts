import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { UnitDTO } from '../dtos/unit.dto';

jest.mock('./unit.service');

const locId = 'some location id';
const unitId = 1;

const data: UnitDTO[] = [];
data.push(new UnitDTO());
data.push(new UnitDTO());

describe('UnitController', () => {
  let controller: UnitController;
  let service: UnitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [UnitController],
      providers: [UnitService],
    }).compile();

    controller = module.get(UnitController);
    service = module.get(UnitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitCapacities', () => {
    it('should return array of unit capacities', async () => {
      jest.spyOn(service, 'getUnits').mockResolvedValue(data);
      expect(await controller.getUnitCapacities(locId, unitId)).toBe(data);
    });
  });
});
