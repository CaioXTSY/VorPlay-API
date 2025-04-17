import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiNoContentResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { ExternalProvider } from '@prisma/client';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favService: FavoritesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Favoritar faixa (valida API + upsert)' })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({ status: 201, description: 'Favorito criado.', type: FavoriteDto })
  @ApiConflictResponse({ description: 'Já favoritado.' })
  @ApiBadRequestResponse({ description: 'Payload inválido.' })
  async add(
    @Req() req,
    @Body() dto: CreateFavoriteDto,
  ): Promise<FavoriteDto> {
    const raw = req.user as any;
    const userId = Number(raw.id ?? raw.sub ?? raw.userId);
    if (!userId) {
      throw new BadRequestException('UserId inválido');
    }

    const fav = await this.favService.add(
      userId,
      dto.externalId,
      dto.externalProvider as ExternalProvider,
    );

    return {
      id: fav.id,
      trackId: fav.track.id,
      externalId: fav.track.externalId,
      title: fav.track.title,
      artist: fav.track.artist,
      album: fav.track.album,
      coverUrl: fav.track.coverUrl,
      createdAt: fav.createdAt,
    };
  }

  @Delete(':trackId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover favorito pelo trackId interno' })
  @ApiParam({
    name: 'trackId',
    type: 'integer',
    description: 'ID interno da faixa',
    example: 42,
  })
  @ApiNoContentResponse({ description: 'Favorito removido.' })
  async remove(
    @Req() req,
    @Param('trackId') trackId: string,
  ) {
    const raw = req.user as any;
    const userId = Number(raw.id ?? raw.sub ?? raw.userId);
    if (!userId) {
      throw new BadRequestException('UserId inválido');
    }
    await this.favService.remove(userId, Number(trackId));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar favoritos do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos do usuário autenticado.',
    type: [FavoriteDto],
  })
  async listOwn(@Req() req): Promise<FavoriteDto[]> {
    const raw = req.user as any;
    const userId = Number(raw.id ?? raw.sub ?? raw.userId);
    if (!userId) {
      throw new BadRequestException('UserId inválido');
    }
    const favs = await this.favService.list(userId);
    return favs.map(f => ({
      id: f.id,
      trackId: f.track.id,
      externalId: f.track.externalId,
      title: f.track.title,
      artist: f.track.artist,
      album: f.track.album,
      coverUrl: f.track.coverUrl,
      createdAt: f.createdAt,
    }));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar favoritos de um usuário por ID' })
  @ApiParam({
    name: 'userId',
    type: 'integer',
    description: 'ID interno do usuário',
    example: 7,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos do usuário especificado.',
    type: [FavoriteDto],
  })
  @ApiBadRequestResponse({ description: 'UserId inválido.' })
  async listByUser(@Param('userId') userId: string): Promise<FavoriteDto[]> {
    const id = Number(userId);
    if (!id) {
      throw new BadRequestException('UserId inválido');
    }
    const favs = await this.favService.list(id);
    return favs.map(f => ({
      id: f.id,
      trackId: f.track.id,
      externalId: f.track.externalId,
      title: f.track.title,
      artist: f.track.artist,
      album: f.track.album,
      coverUrl: f.track.coverUrl,
      createdAt: f.createdAt,
    }));
  }
}