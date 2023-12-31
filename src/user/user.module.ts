import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';


@Module({
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
  imports: [PrismaModule],
})
export class UserModule {}
