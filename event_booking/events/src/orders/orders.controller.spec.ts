import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  const service = { findAll: jest.fn().mockResolvedValue([]) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: service }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('passes the signed-in caller to the service', async () => {
    const user = { customer_id: 'cust_1', isAdmin: false };
    await controller.findAll(user);
    expect(service.findAll).toHaveBeenCalledWith(user);
  });
});
