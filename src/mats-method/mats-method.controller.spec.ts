import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodService } from './mats-method.service';
import { MatsMethodController } from './mats-method.controller';

jest.mock('./mats-method.service');

const locId = 'some location id';

const data: MatsMethodDTO[] = [];
data.push(new MatsMethodDTO());
data.push(new MatsMethodDTO());

describe('MatsMethodController', () => {
  let controller: MatsMethodController;
  let service: MatsMethodService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MatsMethodController],
      providers: [MatsMethodService],
    }).compile();

    controller = module.get(MatsMethodController);
    service = module.get(MatsMethodService);
  });

  describe('getMethods', () => {
    it('should return array of mats methods', async () => {
      jest.spyOn(service, 'getMethods').mockResolvedValue(data);
      expect(await controller.getMethods(locId)).toBe(data);
    });
  });
});
