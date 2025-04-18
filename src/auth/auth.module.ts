import { Module } from '@nestjs/common';
import { AuthService }   from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy }   from './jwt.strategy';
import { UsersModule }   from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule }     from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, JwtStrategy],
  exports:     [AuthService],
})
export class AuthModule {}
