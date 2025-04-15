// src/artists/artists.controller.ts

import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistSummaryDto } from './dto/artist-summary.dto';
import { ArtistInfoDto } from './dto/artist-info.dto';        // <-- import novo
import { AlbumSummaryDto } from './dto/album-summary.dto';
import { TrackSummaryDto } from 'src/tracks/dto/track-summary.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar artistas', description: 'Lista artistas pelo termo.' })
  @ApiQuery({ name: 'query', required: true })
  @ApiResponse({ status: 200, type: [ArtistSummaryDto] })
  async search(@Query('query') query: string): Promise<ArtistSummaryDto[]> {
    if (!query) throw new NotFoundException('Parâmetro "query" é obrigatório.');
    return this.artistsService.searchSummaries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Info básica do artista', description: 'Somente dados principais, sem álbuns nem faixas.' })
  @ApiParam({ name: 'id', description: 'ID do artista' })
  @ApiResponse({ status: 200, type: ArtistInfoDto })
  async detail(@Param('id') id: string): Promise<ArtistInfoDto> {
    return this.artistsService.findDetail(id);
  }

  @Get(':id/albums')
  @ApiOperation({ summary: 'Álbuns do artista' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [AlbumSummaryDto] })
  async albums(@Param('id') id: string): Promise<AlbumSummaryDto[]> {
    return this.artistsService.getAlbums(id);
  }

  @Get(':id/top-tracks')
  @ApiOperation({ summary: 'Top‑tracks do artista' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [TrackSummaryDto] })
  async topTracks(@Param('id') id: string): Promise<TrackSummaryDto[]> {
    return this.artistsService.getTopTracks(id);
  }
}
