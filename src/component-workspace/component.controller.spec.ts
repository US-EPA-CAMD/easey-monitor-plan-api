import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { DataSource } from 'typeorm';

import { ComponentDTO, UpdateComponentBaseDTO } from '../dtos/component.dto';
import { ComponentWorkspaceService } from './component.service';
import { ComponentWorkspaceController } from './component.controller';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ComponentCheckService } from './component-checks.service';
import { SystemComponentMasterDataRelationshipRepository } from '../system-component-master-data-relationship/system-component-master-data-relationship.repository';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { ComponentWorkspaceRepository } from './component.repository';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

jest.mock('./component.service');

const locId = 'some location id';

const data: ComponentDTO[] = [];
data.push(new ComponentDTO());
data.push(new ComponentDTO());

describe('ComponentWorkspaceController', () => {
  let controller: ComponentWorkspaceController;
  let service: ComponentWorkspaceService;
  let checkService: ComponentCheckService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [ComponentWorkspaceController],
      providers: [
        ComponentWorkspaceService,
        ConfigService,
        ComponentCheckService,
        EntityManager,
        SystemComponentMasterDataRelationshipRepository,
        UsedIdentifierRepository,
        ComponentWorkspaceRepository,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(ComponentWorkspaceController);
    service = module.get(ComponentWorkspaceService);
    checkService = module.get(ComponentCheckService);

    jest.spyOn(checkService, 'runChecks').mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of components', async () => {
      jest.spyOn(service, 'getComponents').mockResolvedValue(data);
      expect(await controller.getComponents(locId)).toBe(data);
    });
  });

  describe('createComponent', () => {
    it('should create a new component', async () => {
      const mockedReturnDto = new ComponentDTO();
      const mockedPayloadDto = new UpdateComponentBaseDTO();
      const user: CurrentUser = {
        userId: '',
        sessionId: '',
        expiration: '',
        clientIp: '',
        facilities: [],
        roles: [],
      };
      jest.spyOn(service, 'createComponent').mockResolvedValue(mockedReturnDto);
      expect(await controller.createComponent('', mockedPayloadDto, user)).toBe(
        mockedReturnDto,
      );
    });
  });
});
