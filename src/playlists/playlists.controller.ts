import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, Req, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddTrackDto } from './dto/add-track.dto';

@ApiTags('playlists')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly service: PlaylistsService) {}

  @Get()
  @ApiOperation({ summary: 'Minhas playlists' })
  findAll(@Req() req) {
    return this.service.findAll(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar playlist' })
  create(@Req() req, @Body() dto: CreatePlaylistDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da playlist' })
  @ApiParam({ name: 'id', example: 5 })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar playlist' })
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.service.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir playlist' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id, req.user.userId);
  }

  /* tracks */

  @Post(':id/tracks')
  @ApiOperation({ summary: 'Adicionar faixa' })
  addTrack(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddTrackDto,
  ) {
    return this.service.addTrack(id, req.user.userId, dto);
  }

  @Delete(':playlistId/tracks/:trackId')
  @ApiOperation({ summary: 'Remover faixa' })
  deleteTrack(
    @Req() req,
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('trackId', ParseIntPipe) trackId: number,
  ) {
    return this.service.removeTrack(playlistId, req.user.userId, trackId);
  }

  /* Exportação */

  @Get(':id/export/spotify')
  @ApiOperation({ summary: 'Gerar URIs Spotify' })
  exportUris(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.listSpotifyUris(id, req.user.userId);
  }
}
