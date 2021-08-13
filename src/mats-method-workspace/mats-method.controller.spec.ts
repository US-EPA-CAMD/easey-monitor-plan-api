import { Test, TestingModule } from '@nestjs/testing';
import { CreateMatsMethodDTO } from '../dtos/create-mats-method.dto';
import { UpdateMatsMethodDTO } from '../dtos/update-mats-method.dto';
import { MatsMethodWorkspaceController } from './mats-method.controller';
import { MatsMethodWorkspaceService } from './mats-method.service';

const monLocId = 'string';
const methodId = 'string';
const createMatsMethodPayload: CreateMatsMethodDTO = {
  matsMethodCode: 'string',
  matsMethodParameterCode: 'string',
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};
const upadateMatsMethodPayload: UpdateMatsMethodDTO = {
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};

const mockMatsMethodWorkspaceService = () => ({
  getMethods: jest.fn(mocLocId => []),
  getMethod: jest.fn(methodId => ({})),
  createMethod: jest.fn((monLocId, createMatsMethodPayload) => ({})),
  updateMethod: jest.fn((methodId, monLocId, upadateMatsMethodPayload) => ({})),
});

describe('MatsMethodWorkspaceController', () => {
  let controller: MatsMethodWorkspaceController;
  let service: MatsMethodWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatsMethodWorkspaceController],
      providers: [
        {
          provide: MatsMethodWorkspaceService,
          useFactory: mockMatsMethodWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<MatsMethodWorkspaceController>(
      MatsMethodWorkspaceController,
    );
    service = module.get<MatsMethodWorkspaceService>(
      MatsMethodWorkspaceService,
    );
  });

  describe('getMethods', () => {
    it('should call the MatsMethodWorkspaceService.getMethods', () => {
      expect(controller.getMethods(monLocId)).toEqual([]);
      expect(service.getMethods).toHaveBeenCalled();
    });
  });

  describe('createMethod', () => {
    it('should call the MatsMethodWorkspaceService.createMethod', () => {
      expect(
        controller.createMethod(monLocId, createMatsMethodPayload),
      ).toEqual({});
      expect(service.createMethod).toHaveBeenCalled();
    });
  });

  describe('createMethods', () => {
    it('should call the MatsMethodWorkspaceService.updateMethod', () => {
      expect(
        controller.updateMethod(methodId, monLocId, upadateMatsMethodPayload),
      ).toEqual({});
      expect(service.updateMethod).toHaveBeenCalled();
    });
  });
});
