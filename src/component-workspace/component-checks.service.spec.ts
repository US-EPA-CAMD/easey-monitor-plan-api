import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { ComponentCheckService } from './component-checks.service';
import { ComponentDTO } from '../dtos/component.dto';
import { SystemComponentMasterDataRelationshipRepository } from '../system-component-master-data-relationship/system-component-master-data-relationship.repository';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { UsedIdentifier } from '../entities/used-identifier.entity';
import { ComponentWorkspaceRepository } from './component.repository';
import { Component } from '../entities/workspace/component.entity';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const locationId = '1';
const payload = new ComponentDTO();
const usedIdentifierRecord = new UsedIdentifier();

describe('Component Checks Service Test', () => {
  let service: ComponentCheckService;
  let usedIdRepository: UsedIdentifierRepository;
  let sysCompMDRelRepository: SystemComponentMasterDataRelationshipRepository;
  let componentRepository: ComponentWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        ComponentCheckService,
        {
          provide: SystemComponentMasterDataRelationshipRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(null),
          }),
        },
        {
          provide: UsedIdentifierRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(null),
          }),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: () => ({
            getComponentByLocIdAndCompId: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    service = module.get(ComponentCheckService);
    usedIdRepository = module.get(UsedIdentifierRepository);
    componentRepository = module.get(ComponentWorkspaceRepository);
    sysCompMDRelRepository = module.get(
      SystemComponentMasterDataRelationshipRepository,
    );
  });

  describe('COMPON-13 Checks', () => {
    it('Should get [COMPON-13-A] error', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);
      jest.spyOn(sysCompMDRelRepository, 'findOne').mockResolvedValueOnce(null);

      payload.sampleAcquisitionMethodCode = null;
      payload.componentTypeCode = 'ABC';
      payload.basisCode = 'W';

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });
  });

  describe('COMPON-14 Checks', () => {
    it('Should get [COMPON-14-A] error', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.componentTypeCode = 'NOX';
      payload.basisCode = null;

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });

    it('Should get [COMPON-14-B] error when BasisCode is not equal to "W", "D", or "B"', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.componentTypeCode = 'NOX';
      payload.basisCode = 'C';

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });

    it('Should get [COMPON-14-B] error when ComponentTypeCode is equal to "FLOW" and BasisCode is not equal to "W"', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.componentTypeCode = 'FLOW';
      payload.basisCode = 'D';

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });

    it('Should get [COMPON-14-B] error when ComponentTypeCode is equal to "STRAIN", and BasisCode is not equal to "D"', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.componentTypeCode = 'STRAIN';
      payload.basisCode = 'W';

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });

    it('Should get [COMPON-14-B] error when BasisCode is equal to "B" and the ComponentTypeCode is not equal to "O2"', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.componentTypeCode = 'HCL';
      payload.basisCode = 'B';

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });

    it('Should get [COMPON-14-C] error when BasisCode is not equal to "B"', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);
      usedIdentifierRecord.formulaOrBasisCode = 'B';
      jest
        .spyOn(usedIdRepository, 'findOne')
        .mockResolvedValueOnce(usedIdentifierRecord);

      payload.componentTypeCode = 'NOX';
      payload.componentId = 'HFA';
      payload.basisCode = 'W';

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });

    it('Should get [COMPON-14-D] error ', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.componentId = 'STR';
      payload.basisCode = 'C';

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });
  });

  describe('COMPON-53 Checks', () => {
    it('Should get [COMPON-53-A] error', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);
      const comp = new Component();
      jest
        .spyOn(componentRepository, 'getComponentByLocIdAndCompId')
        .mockResolvedValueOnce(comp);

      payload.componentId = '1';
      payload.componentTypeCode = 'BGFF';
      payload.basisCode = null;

      let errored = false;

      try {
        await service.runChecks(locationId, payload);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });
  });
});
