import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HelloModule } from '../hello.module';
import { HelloController } from '../hello.controller';
import { HelloService } from '../hello.service';
import { HelloEntity } from '../hello.entity';

describe('HelloModule', () => {
  let module: TestingModule;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HelloModule],
    })
      .overrideProvider(getRepositoryToken(HelloEntity))
      .useValue(mockRepository)
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have HelloController', () => {
    const controller = module.get<HelloController>(HelloController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(HelloController);
  });

  it('should have HelloService', () => {
    const service = module.get<HelloService>(HelloService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(HelloService);
  });

  it('should inject repository into service', () => {
    const service = module.get<HelloService>(HelloService);
    expect(service).toBeDefined();
    // Service should be properly instantiated with repository
    expect(service['helloRepository']).toBeDefined();
  });

  it('should provide all required dependencies', () => {
    const controller = module.get<HelloController>(HelloController);
    const service = module.get<HelloService>(HelloService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should wire controller and service together', () => {
    const controller = module.get<HelloController>(HelloController);
    const service = module.get<HelloService>(HelloService);

    // Controller should have service injected
    expect(controller['helloService']).toBe(service);
  });
});
