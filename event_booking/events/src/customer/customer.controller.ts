import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  AdminOnly,
  AuthUser,
  CurrentUser,
  Public,
} from '../auth/auth.decorators';
import { ParseIdPipe } from '../common/parse-id.pipe';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Public()
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginCustomerDto) {
    return this.customerService.login(loginDto);
  }

  @AdminOnly()
  @Get()
  findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.customerService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.customerService.update(id, updateCustomerDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.customerService.remove(id, user);
  }
}
