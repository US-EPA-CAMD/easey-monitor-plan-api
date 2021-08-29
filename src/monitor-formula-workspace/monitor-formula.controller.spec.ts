import { Test, TestingModule } from '@nestjs/testing';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaWorkspaceController } from './monitor-formula.controller';

jest.mock('./monitor-formula.service');

const locId = 'some location id';

const data: MonitorFormulaDTO[] = [];
data.push(new MonitorFormulaDTO());
data.push(new MonitorFormulaDTO());

describe('MonitorFormulaWorkspaceController', () => {
  let controller: MonitorFormulaWorkspaceController;
  let service: MonitorFormulaWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorFormulaWorkspaceController],
      providers: [MonitorFormulaWorkspaceService],
    }).compile();

    controller = module.get(MonitorFormulaWorkspaceController);
    service = module.get(MonitorFormulaWorkspaceService);
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
