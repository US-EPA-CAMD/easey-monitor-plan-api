import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitProgramWorkspaceService } from './unit-program.service';
import { UnitProgramDTO } from '../dtos/unit-program.dto';
import { UnitProgramWorkspaceController } from './unit-program.controller';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

jest.mock('./unit-program.service');

const unitId = 1;

const data: UnitProgramDTO[] = [];
data.push(new UnitProgramDTO());
data.push(new UnitProgramDTO());

describe('UnitProgramWorkspaceController', () => {
  let controller: UnitProgramWorkspaceController;
  let service: UnitProgramWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [UnitProgramWorkspaceController],
      providers: [
        UnitProgramWorkspaceService,
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(UnitProgramWorkspaceController);
    service = module.get(UnitProgramWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitPrograms', () => {
    it('should return array of workspace unit programs', async () => {
      jest
        .spyOn(service, 'getUnitProgramsByUnitRecordId')
        .mockResolvedValue(data);
      expect(await controller.getUnitProgramsByUnitRecordId(unitId)).toBe(data);
    });
  });
});
