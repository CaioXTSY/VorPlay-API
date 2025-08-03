import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

class AuthResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiI...' })
  access_token: string;

  @ApiProperty({ example: 3600 })
  expires_in: number;

  @ApiProperty({ example: { id: 1, email: 'caio@exemplo.com' } })
  user: { id: number; email: string };
}

class MessageResponse {
  @ApiProperty({ example: 'Operação realizada com sucesso' })
  message: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado e token gerado', type: AuthResponse })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({ status: 200, description: 'Login bem‑sucedido', type: AuthResponse })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Validar e renovar token' })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso', type: AuthResponse })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateToken(@Request() req): Promise<AuthResponse> {
    return this.authService.generateToken(req.user.sub, req.user.email);
  }

  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({ status: 200, description: 'Email de recuperação enviado', type: MessageResponse })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<MessageResponse> {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiOperation({ summary: 'Redefinir senha com token' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso', type: MessageResponse })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponse> {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
