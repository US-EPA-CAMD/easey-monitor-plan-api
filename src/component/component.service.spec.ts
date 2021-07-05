// import { Test } from '@nestjs/testing';
// import { ConfigService } from '@nestjs/config';
// import { ComponentController } from './component.controller';
// import { ComponentService } from './component.service';
// import { ComponentRepository } from './component.repository';
// import { ComponentMap } from '../maps/component.map';
// import { ComponentDTO } from '../dtos/component.dto';
// import { MonitorSystemComponentRepository } from '../monitor-system/monitor-system-component.repository';
// import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
// import { SystemComponentMap } from '../maps/monitor-system-component.map';
// import { MonitorMethodMap } from '../maps/monitor-method.map';
// import { AnalyzerRangeRepository } from '../analyzer-range/analyzer-range.repository';
// import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
// import { AnalyzerRange } from '../entities/analyzer-range.entity';

// const mockConfigService = () => ({
//   get: jest.fn(),
// });

// describe('-- Supplemental Methods Controller --', () => {
//   let supplementalMethodsController: ComponentController;
//   let supplementalMethodsService: ComponentService;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       controllers: [ComponentController],
//       providers: [
//         ComponentMap,
//         ComponentService,
//         ComponentRepository,
//         MonitorSystemComponentRepository,
//         MonitorSystemComponent,
//         SystemComponentMap,
//         MonitorMethodMap,
//         AnalyzerRangeRepository,
//         AnalyzerRangeMap,
//         AnalyzerRange,
//         {
//           provide: ConfigService,
//           useFactory: mockConfigService,
//         },
//       ],
//     }).compile();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   describe('* getSystemComponent', () => {
//     it('should return a list of components', async () => {
//       const monLocId = '123';
//       const expectedResult: ComponentDTO[] = [];

//       return true;
//     });
//   });

//   describe('* setComponentDate', () => {
//     it('should return a list of components', async () => {
//       const monLocId = '123';
//       const expectedResult: ComponentDTO[] = [];

//       return true;
//     });
//   });
// });
