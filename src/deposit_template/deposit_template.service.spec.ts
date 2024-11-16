import { Test, TestingModule } from '@nestjs/testing';
import { DepositTemplateService } from './deposit_template.service';

describe('DepositTemplateService', () => {
  let service: DepositTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositTemplateService],
    }).compile();

    service = module.get<DepositTemplateService>(DepositTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
