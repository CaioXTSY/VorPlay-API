import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) {
      throw new ConflictException('Email já cadastrado');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ name, email, password: hash });
    return this.generateToken(user.id, user.email);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.generateToken(user.id, user.email);
  }

  generateToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 3600,
      user: { id: userId, email },
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Por segurança, não revelamos se o email existe ou não
      return { message: 'Se o email existir em nossa base, você receberá um link de recuperação.' };
    }

    // Gera token aleatório para reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salva o token no banco
    await this.usersService.updateResetToken(user.id, resetToken, resetExpires);

    // Envia email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Se o email existir em nossa base, você receberá um link de recuperação.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Verifica se o token não expirou
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha e remove o token
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'Senha alterada com sucesso' };
  }
}