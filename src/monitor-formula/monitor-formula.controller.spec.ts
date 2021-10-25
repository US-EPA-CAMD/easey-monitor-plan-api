import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaService } from './monitor-formula.service';
import { MonitorFormulaController } from './monitor-formula.controller';

jest.mock('./monitor-formula.service');

const locId = 'some location id';

const data: MonitorFormulaDTO[] = [];
data.push(new MonitorFormulaDTO());
data.push(new MonitorFormulaDTO());

describe('MonitorFormulaController', () => {
  let controller: MonitorFormulaController;
  let service: MonitorFormulaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorFormulaController],
      providers: [MonitorFormulaService],
    }).compile();

    controller = module.get(MonitorFormulaController);
    service = module.get(MonitorFormulaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFormulas', () => {
    it('should return array of monitor formulas', async () => {
      jest.spyOn(service, 'getFormulas').mockResolvedValue(data);
      expect(await controller.getFormulas(locId)).toBe(data);
    });
  });
});
