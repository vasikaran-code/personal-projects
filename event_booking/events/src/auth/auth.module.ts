import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from '../customer/entities/customer.entity';
import { AuthGuard } from './auth.guard';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  providers: [
    TokenService,
    PasswordService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [TokenService, PasswordService],
})
export class AuthModule {}
