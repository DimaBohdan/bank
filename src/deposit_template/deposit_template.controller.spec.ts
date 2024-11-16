import { Test, TestingModule } from '@nestjs/testing';
import { DepositTemplateController } from './deposit_template.controller';
import { DepositTemplateService } from './deposit_template.service';

describe('DepositTemplateController', () => {
  let controller: DepositTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositTemplateController],
      providers: [DepositTemplateService],
    }).compile();

    controller = module.get<DepositTemplateController>(DepositTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
