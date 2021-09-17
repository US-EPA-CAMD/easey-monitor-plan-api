import { TestingModule, Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

const client = {
  ValidateAsync: jest.fn(() => Promise.resolve([{ return: '' }])),
};

let sessionRecord = {
  tokenExpiration: '100000000000000000000000',
};

let managerReturn = jest.fn().mockResolvedValue(sessionRecord);

jest.mock('soap', () => ({
  createClientAsync: jest.fn(() => Promise.resolve(client)),
}));

jest.mock('../utils', () => ({
  parseToken: jest.fn(() =>
    jest.fn().mockReturnValue({ sessionId: '', userId: '' }),
  ),
}));

jest.mock('../entities/user-session.entity', jest.fn().mockReturnValue({}));

jest.mock('typeorm', () => ({
  getManager: () => {
    return { findOne: managerReturn };
  },
}));

describe('AuthGuard', () => {
  let guard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, ConfigService],
    }).compile();

    guard = module.get(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should validate properly and return true given good input', async () => {
    const request = { headers: { authorization: 'Bearer csm::nndifnd' } };
    expect(await guard.validateRequest(request)).toEqual(true);
  });

  it('should error given an expired existing session', async () => {
    sessionRecord = {
      tokenExpiration: '0',
    };

    const request = { headers: { authorization: 'Bearer csm::nndifnd' } };
    expect(async () => {
      await guard.validateRequest(request);
    }).rejects.toThrowError();
  });

  it('should error given a non-existing session', async () => {
    managerReturn = jest.fn().mockResolvedValue(false);

    const request = { headers: { authorization: 'Bearer csm::nndifnd' } };
    expect(async () => {
      await guard.validateRequest(request);
    }).rejects.toThrowError();
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
