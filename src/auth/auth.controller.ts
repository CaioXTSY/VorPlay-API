// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation }  from '@nestjs/swagger';
import { AuthService }           from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

@ApiTags('auth')          // agrupa no Swagger
@Controller('auth')       // define /auth como prefixo
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login do usuário' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
