import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Query, Request, UseGuards, Patch, UseInterceptors, UploadedFile, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiProduces } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SearchUsersDto } from './dto/search-users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { Response } from 'express';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import * as crypto from 'crypto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    // Garante que o diretório de uploads existe
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory() {
    const uploadsPath = resolve(process.env.UPLOADS_PATH || './uploads', 'profile-pictures');
    if (!existsSync(uploadsPath)) {
      mkdirSync(uploadsPath, { recursive: true });
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retornar o perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado' })
  @Put('me')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remover a conta do usuário logado' })
  @ApiResponse({ status: 200, description: 'Usuário removido' })
  @Delete('me')
  removeProfile(@Request() req) {
    return this.usersService.remove(req.user.userId);
  }
  
  @ApiOperation({ summary: 'Buscar usuários por nome ou email' })
  @ApiResponse({ status: 200, description: 'Lista de usuários encontrados' })
  @Get('search')
  search(@Query() searchDto: SearchUsersDto) {
    return this.usersService.searchUsers(searchDto);
  }

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Upload de foto de perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'URL da foto de perfil atualizada', schema: { example: { url: '/uploads/profile-pictures/123456789.jpg' } } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem para foto de perfil',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Patch('me/profile-picture')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: resolve(process.env.UPLOADS_PATH || './uploads', 'profile-pictures'),
      filename: (req, file, cb) => {
        // Gera hash SHA256 do conteúdo do arquivo e do timestamp
        const hash = crypto.createHash('sha256');
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        hash.update(file.originalname + unique);
        const ext = extname(file.originalname);
        cb(null, hash.digest('hex') + ext);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
        return cb(new Error('Apenas imagens são permitidas!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }))
  async uploadProfilePicture(@UploadedFile() file: any, @Req() req) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/uploads/profile-pictures/${file.filename}`;
    await this.usersService.update(req.user.userId, { profilePicture: url });
    return { url };
  }

  @ApiOperation({ summary: 'Obter foto de perfil do usuário por ID' })
  @ApiProduces('image/jpeg', 'image/png', 'image/webp')
  @ApiParam({ name: 'id', example: 3, description: 'ID do usuário' })
  @Get('profile-picture/user/:id')
  async getProfilePictureByUserId(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const user = await this.usersService.findById(id);
    if (!user || !user.profilePicture) {
      return res.status(404).send('Imagem não encontrada');
    }
    // Extrai o nome do arquivo da URL salva
    const filename = user.profilePicture?.split('/').pop() || '';
    if (!filename) {
      return res.status(404).send('Imagem não encontrada');
    }
    const filePath = resolve(process.env.UPLOADS_PATH || './uploads', 'profile-pictures', filename);
    if (!existsSync(filePath)) {
      return res.status(404).send('Imagem não encontrada');
    }
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }
}
