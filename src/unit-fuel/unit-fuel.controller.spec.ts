import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelController } from './unit-fuel.controller';
import { UnitFuelService } from './unit-fuel.service';

jest.mock('./unit-fuel.service');

const locId = '6';
const unitRecordId = 1;

const data: UnitFuelDTO[] = [];
data.push(new UnitFuelDTO());
data.push(new UnitFuelDTO());

describe('UnitFuelController', () => {
  let controller: UnitFuelController;
  let service: UnitFuelService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [UnitFuelController],
      providers: [UnitFuelService],
    }).compile();

    controller = module.get(UnitFuelController);
    service = module.get(UnitFuelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitFuels', () => {
    it('should return array of unit fuels', async () => {
      jest.spyOn(service, 'getUnitFuels').mockResolvedValue(data);
      expect(await controller.getUnitFuels(locId, unitRecordId)).toBe(data);
    });
  });
});
