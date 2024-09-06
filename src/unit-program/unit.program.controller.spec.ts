import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitProgramService } from './unit-program.service';
import { UnitProgramController } from './unit-program.controller';
import { UnitProgramDTO } from '../dtos/unit-program.dto';

jest.mock('./unit-program.service');

const locId = 'some location id';
const unitId = 1;

const data: UnitProgramDTO[] = [];
data.push(new UnitProgramDTO());
data.push(new UnitProgramDTO());

describe('UnitProgramController', () => {
  let controller: UnitProgramController;
  let service: UnitProgramService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [UnitProgramController],
      providers: [UnitProgramService],
    }).compile();

    controller = module.get(UnitProgramController);
    service = module.get(UnitProgramService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitPrograms', () => {
    it('should return array of unit programs', async () => {
      jest.spyOn(service, 'getUnitPrograms').mockResolvedValue(data);
      expect(await controller.getUnitPrograms(locId, unitId)).toBe(data);
    });
  });
});
