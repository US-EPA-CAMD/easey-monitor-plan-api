import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { UnitDTO } from '../dtos/unit.dto';

jest.mock('./unit.service');

const unitId = 1;

const data = new UnitDTO();

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

  describe('getUnits', () => {
    it('should return array of units', async () => {
      jest.spyOn(service, 'getUnit').mockResolvedValue(data);
      expect(await controller.getUnit(unitId)).toStrictEqual(data);
    });
  });
});
