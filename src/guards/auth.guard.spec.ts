import { TestingModule, Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';

jest.mock('../utils', () => ({
  parseToken: jest.fn(() =>
    jest.fn().mockReturnValue({ sessionId: '', userId: '' }),
  ),
}));

describe('AuthGuard', () => {
  let guard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthGuard, ConfigService],
    }).compile();

    guard = module.get(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should validate properly and return true given good input', async () => {
    jest.spyOn(guard, 'validateToken').mockResolvedValue('');

    const request = { headers: { authorization: 'Bearer csm::nndifnd' } };
    expect(await guard.validateRequest(request)).toEqual(true);
  });

  it('should error given no auth header', async () => {
    const request = { headers: {} };
    expect(async () => {
      await guard.validateRequest(request);
    }).rejects.toThrowError();
  });

  it('should error given invalid bearer format', async () => {
    const request = { headers: { authorization: 'Beater 3' } };
    expect(async () => {
      await guard.validateRequest(request);
    }).rejects.toThrowError();
  });
});
