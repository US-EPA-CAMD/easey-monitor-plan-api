import { Test, TestingModule } from '@nestjs/testing';

import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlWorkspaceController } from './unit-control.controller';
import { UnitControlWorkspaceService } from './unit-control.service';
import { UpdateUnitControlDTO } from '../dtos/unit-control-update.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

jest.mock('./unit-control.service');

const locId = '6';
const unitRecordId = 1;
const unitControlId = 'some unit control id';
const currentUser = 'testuser';
const payload = new UpdateUnitControlDTO();

const returnedUnitControls: UnitControlDTO[] = [];
returnedUnitControls.push(new UnitControlDTO());

const returnedLoad = new UnitControlDTO();

describe('UnitControlWorkspaceController', () => {
  let controller: UnitControlWorkspaceController;
  let service: UnitControlWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UnitControlWorkspaceController],
      providers: [UnitControlWorkspaceService, ConfigService, AuthGuard],
    }).compile();

    controller = module.get(UnitControlWorkspaceController);
    service = module.get(UnitControlWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitControls', () => {
    it('should return array of unit controls', async () => {
      jest
        .spyOn(service, 'getUnitControls')
        .mockResolvedValue(returnedUnitControls);
      expect(await controller.getUnitControls(locId, unitRecordId)).toBe(
        returnedUnitControls,
      );
    });
  });

  describe('updateUnitControl', () => {
    it('should return updated unit control', async () => {
      jest.spyOn(service, 'updateUnitControl').mockResolvedValue(returnedLoad);
      expect(
        await controller.updateUnitControl(
          currentUser,
          locId,
          unitRecordId,
          unitControlId,
          payload,
        ),
      ).toBe(returnedLoad);
    });
  });

  describe('createUnitControl', () => {
    it('should return the created unit control record', async () => {
      jest.spyOn(service, 'createUnitControl').mockResolvedValue(returnedLoad);
      expect(
        await controller.createUnitControl(
          currentUser,
          locId,
          unitRecordId,
          payload,
        ),
      ).toBe(returnedLoad);
    });
  });
});
