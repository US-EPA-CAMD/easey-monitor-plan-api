// import { Test } from '@nestjs/testing';
// import { ConfigService } from '@nestjs/config';

// import { MatsMethodDataDTO } from '../dtos/mats-method-data.dto';
// import { MatsMethodMap } from '../maps/mats-method.map';
// import { SupplementalMethodsController } from './mats-method.controller';
// import { MatsMethodRepository } from './mats-method.repository';
// import { SupplementalMethodsService } from './mats-method.service';

// const mockConfigService = () => ({
//   get: jest.fn(),
// });

// describe('-- Supplemental Methods Controller --', () => {
//   let supplementalMethodsController: SupplementalMethodsController;
//   let supplementalMethodsService: SupplementalMethodsService;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       controllers: [SupplementalMethodsController],
//       providers: [
//         MatsMethodMap,
//         SupplementalMethodsService,
//         MatsMethodRepository,
//         {
//           provide: ConfigService,
//           useFactory: mockConfigService,
//         },
//       ],
//     }).compile();

//     supplementalMethodsController = module.get(SupplementalMethodsController);
//     supplementalMethodsService = module.get(SupplementalMethodsService);
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   describe('* getsSupplementalMethods', () => {
//     it('should return a list of Supplemental Methods', async () => {
//       const monLocId = '123';
//       const expectedResult: MatsMethodDataDTO[] = [];

//       const serviceSpy = jest
//         .spyOn(supplementalMethodsService, 'getMatsMethods')
//         .mockResolvedValue(expectedResult);

//       const result = await supplementalMethodsController.getMethods(monLocId);

//       expect(serviceSpy).toHaveBeenCalledWith(monLocId);
//       expect(result).toBe(expectedResult);
//     });
//   });
// });
