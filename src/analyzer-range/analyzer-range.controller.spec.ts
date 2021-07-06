import { Test, TestingModule } from '@nestjs/testing';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeService } from './analyzer-range.service';
import { AnalyzerRangeController } from './analyzer-range.controller';

jest.mock('./analyzer-range.service');

const locId = 'some location id';
const compId = 'some component id';

const data: AnalyzerRangeDTO[] = [];
data.push(new AnalyzerRangeDTO());
data.push(new AnalyzerRangeDTO());

describe('AnalyzerRangeController', () => {
  let controller: AnalyzerRangeController;
  let service: AnalyzerRangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyzerRangeController],
      providers: [AnalyzerRangeService],
    }).compile();

    controller = module.get(AnalyzerRangeController);
    service = module.get(AnalyzerRangeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAnalyzerRanges', () => {
    it('should return array of analyzer ranges', async () => {
      jest.spyOn(service, 'getAnalyzerRanges').mockResolvedValue(data);
      expect(await controller.getAnalyzerRanges(locId, compId)).toBe(data);
    });
  });
});
