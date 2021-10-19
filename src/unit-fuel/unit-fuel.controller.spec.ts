import { Test, TestingModule } from '@nestjs/testing';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelController } from './unit-fuel.controller';
import { UnitFuelService } from './unit-fuel.service';

jest.mock('./unit-fuel.service');

const UnitFuelId = 123;

const data: UnitFuelDTO[] = [];
data.push(new UnitFuelDTO());
data.push(new UnitFuelDTO());

describe('UnitFuelController', () => {
  let controller: UnitFuelController;
  let service: UnitFuelService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      expect(await controller.getUnitFuels(UnitFuelId)).toBe(data);
    });
  });
});
