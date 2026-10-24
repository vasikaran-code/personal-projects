import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

describe('CustomerController', () => {
  let controller: CustomerController;
  const service = { findOne: jest.fn().mockResolvedValue(null) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [{ provide: CustomerService, useValue: service }],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('passes the signed-in caller to the service', async () => {
    const user = { customer_id: 'cust_1', isAdmin: false };
    await controller.findOne('cust_1', user);
    expect(service.findOne).toHaveBeenCalledWith('cust_1', user);
  });
});
