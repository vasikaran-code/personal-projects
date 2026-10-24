import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerModel: typeof Customer;

  const mockCustomer = {
    customer_id: '1',
    cust_name: 'Test Customer',
    email: 'test@example.com',
    password: 'password123',
    save: jest.fn(),
    destroy: jest.fn(),
  };

  const mockCustomerModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getModelToken(Customer),
          useValue: mockCustomerModel,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerModel = module.get<typeof Customer>(getModelToken(Customer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      mockCustomerModel.create.mockResolvedValue(mockCustomer);
      const dto = {
        cust_name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
      };
      const result = await service.create(dto);
      expect(mockCustomerModel.create).toHaveBeenCalledWith({
        customer_id: expect.any(Number),
        ...dto,
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should return null if required fields are missing', async () => {
      const dto = { cust_name: '', email: '', password: '' };
      const result = await service.create(dto);
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      mockCustomerModel.findAll.mockResolvedValue([mockCustomer]);
      const result = await service.findAll();
      expect(mockCustomerModel.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCustomer]);
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      mockCustomerModel.findOne.mockResolvedValue(mockCustomer);
      const result = await service.findOne('1');
      expect(mockCustomerModel.findOne).toHaveBeenCalledWith({
        where: { customer_id: '1' },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should return null if customer is not found', async () => {
      mockCustomerModel.findOne.mockResolvedValue(null);
      const result = await service.findOne('2');
      expect(result).toBeNull();
    });
  });

  // describe('update', () => {
  //   it('should update a customer', async () => {
  //     // jest.spyOn(service, 'findOne').mockResolvedValue();
  //     mockCustomer.save.mockResolvedValue(mockCustomer);
  //     const dto = { cust_name: 'Updated Name' };
  //     const result = await service.update('1', dto);
  //     expect(service.findOne).toHaveBeenCalledWith('1');
  //     expect(mockCustomer.save).toHaveBeenCalled();
  //     expect(result).toEqual(mockCustomer);
  //   });

  //   it('should throw NotFoundException if customer is not found', async () => {
  //     jest.spyOn(service, 'findOne').mockResolvedValue(null);
  //     await expect(service.update('2', { cust_name: 'Updated Name' })).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });
  // });

  // describe('remove', () => {
  //   it('should remove a customer', async () => {
  //     mockCustomerModel.findOne.mockResolvedValue(mockCustomer);
  //     mockCustomerModel.destroy.mockResolvedValue(1);
  //     const result = await service.remove('1');
  //     expect(mockCustomerModel.findOne).toHaveBeenCalledWith({
  //       where: { customer_id: '1' },
  //     });
  //     expect(mockCustomerModel.destroy).toHaveBeenCalledWith({
  //       where: { customer_id: '1' },
  //     });
  //     expect(result).toEqual(mockCustomer);
  //   });

  //   it('should throw NotFoundException if customer is not found', async () => {
  //     mockCustomerModel.findOne.mockResolvedValue(null);
  //     await expect(service.remove('2')).rejects.toThrow(NotFoundException);
  //   });
  // });
});
