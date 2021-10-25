import { Test, TestingModule } from '@nestjs/testing';

import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelWorkspaceController } from './unit-fuel.controller';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { UpdateUnitFuelDTO } from '../dtos/unit-fuel-update.dto';
import { HttpModule } from '@nestjs/common';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

jest.mock('./unit-fuel.service');

const unitId = 6;
const UnitFuelId = 'some unit fuel id';
const currentUser = 'testuser';
const payload = new UpdateUnitFuelDTO();

const returnedUnitFuels: UnitFuelDTO[] = [];
returnedUnitFuels.push(new UnitFuelDTO());

const returnedLoad = new UnitFuelDTO();

describe('UnitFuelWorkspaceController', () => {
  let controller: UnitFuelWorkspaceController;
  let service: UnitFuelWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UnitFuelWorkspaceController],
      providers: [UnitFuelWorkspaceService, ConfigService, AuthGuard],
    }).compile();

    controller = module.get(UnitFuelWorkspaceController);
    service = module.get(UnitFuelWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitFuels', () => {
    it('should return array of unit fuels', async () => {
      jest.spyOn(service, 'getUnitFuels').mockResolvedValue(returnedUnitFuels);
      expect(await controller.getUnitFuels(unitId)).toBe(returnedUnitFuels);
    });
  });

  describe('updateUnitFuel', () => {
    it('should return updated unit fuel', async () => {
      jest.spyOn(service, 'updateUnitFuel').mockResolvedValue(returnedLoad);
      expect(
        await controller.updateUnitFuel(
          currentUser,
          unitId,
          UnitFuelId,
          payload,
        ),
      ).toBe(returnedLoad);
    });
  });

  describe('createUnitFuel', () => {
    it('should return the created unit fuel record', async () => {
      jest.spyOn(service, 'createUnitFuel').mockResolvedValue(returnedLoad);
      expect(
        await controller.createUnitFuel(currentUser, unitId, payload),
      ).toBe(returnedLoad);
    });
  });
});
