import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddTrackDto } from './dto/add-track.dto';
import { PlaylistDto } from './dto/playlist.dto';

@ApiTags('playlists')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly service: PlaylistsService) {}

  /* ───────── playlists ───────── */

  @Get()
  @ApiOperation({ summary: 'Minhas playlists' })
  findAll(@Req() req) {
    return this.service.findAll(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar playlist' })
  @ApiResponse({ status: 201, type: PlaylistDto })
  create(@Req() req, @Body() dto: CreatePlaylistDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da playlist' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: PlaylistDto })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar playlist (nome/descrição)' })
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

  /* ───────── tracks ───────── */

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
}
