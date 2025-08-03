import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const logoPath = path.join(process.cwd(), 'media', 'vorp.jpg');
    
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: 'VorPlay - Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="cid:vorplay-logo" alt="VorPlay" style="max-width: 150px; height: auto;">
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Recuperação de Senha</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Olá!</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Você solicitou a recuperação de sua senha no <strong>VorPlay</strong>. 
              Clique no botão abaixo para definir uma nova senha:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(45deg, #007bff, #0056b3); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0,123,255,0.3);">
                🔑 Redefinir Senha
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; line-height: 1.6;">
              Se você não conseguir clicar no botão, copie e cole o link abaixo no seu navegador:
            </p>
            <p style="color: #007bff; font-size: 14px; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; line-height: 1.4;">
                ⚠️ Se você não solicitou esta recuperação, ignore este email com segurança.
              </p>
              <p style="color: #999; font-size: 12px; line-height: 1.4;">
                🕐 Este link expira em 1 hora por motivos de segurança.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 12px;">
              © 2025 VorPlay - Sua plataforma de música favorita 🎵
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'vorp.jpg',
          path: logoPath,
          cid: 'vorplay-logo'
        }
      ]
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de recuperação enviado para: ${email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email de recuperação para ${email}:`, error);
      throw new Error('Falha ao enviar email de recuperação');
    }
  }
}
