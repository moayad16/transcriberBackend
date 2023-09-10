import { Test, TestingModule } from '@nestjs/testing';
import { SocketgatewayGateway } from './socketgateway.gateway';

describe('SocketgatewayGateway', () => {
  let gateway: SocketgatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketgatewayGateway],
    }).compile();

    gateway = module.get<SocketgatewayGateway>(SocketgatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
