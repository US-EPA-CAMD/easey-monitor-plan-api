// import { Test } from '@nestjs/testing';
// import { MonitorPlanRepository } from './monitor-plan.repository';
// import { MonitorPlanParamsDTO } from 'src/dtos/monitor-plan-params.dto';

// describe('MonitorPlanRepository', () => {
//   let monitorPlanRepository;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [MonitorPlanRepository],
//     }).compile();

//     monitorPlanRepository = module.get<MonitorPlanRepository>(
//       MonitorPlanRepository,
//     );
//   });

//   describe('getMonitorPlan', () => {
//     it('gets all monitoring plan static data from the repository', async () => {
//       const params: MonitorPlanParamsDTO = {
//         facId: 1,
//         orisCode: 1,
//         active: true,
//         page: 1,
//         perPage: 1,
//         orderBy: 'some string',
//       };
//       const result = monitorPlanRepository.getMonitorPlan(params);

//       expect(Array.isArray(result)).toBe(true);
//     });
//   });
// });
