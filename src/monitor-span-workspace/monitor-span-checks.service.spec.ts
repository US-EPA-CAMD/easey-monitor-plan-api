import { MonitorSpan } from "../entities/workspace/monitor-span.entity";
import { MonitorSpanWorkspaceRepository } from "./monitor-span.repository";
import { MonitorSpanWorkspaceService } from "./monitor-span.service";


describe('Monitoring Span Check Service Test', () => {
    let service: MonitorSpanWorkspaceService;
    let repository: MonitorSpanWorkspaceRepository;
it('Should get error for SPAN-17 - Flow Span Full Scale Range Value Valid check Result A', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(new MonitorSpan());


  });
})