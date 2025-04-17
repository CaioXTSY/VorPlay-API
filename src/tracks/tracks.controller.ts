import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { TracksService }       from './tracks.service';
import { TrackSummaryDto }     from './dto/track-summary.dto';
import { TrackDetailDto }      from './dto/track-detail.dto';
import { AlbumTrackDto }       from './dto/album-track.dto';
import { TrackCursorPageDto }  from './dto/track-cursor-page.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import {
  ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam,
} from '@nestjs/swagger';

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar faixas', description: 'Pesquisa faixas cursor‑based numérico.' })
  @ApiQuery({ name: 'query',  required: true,  example: 'blinding lights' })
  @ApiQuery({ name: 'cursor', required: false, example: 0 })
  @ApiQuery({ name: 'limit',  required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Página de faixas resumidas',
    type: TrackCursorPageDto,
  })
  async search(
    @Query('query') query: string,
    @Query() { cursor = 0, limit }: CursorPaginationDto,
  ): Promise<TrackCursorPageDto> {
    if (!query) {
      throw new NotFoundException('Parâmetro "query" é obrigatório.');
    }
    return this.tracksService.searchSummaries(query, limit, cursor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes da faixa' })
  @ApiParam({ name: 'id', example: '0VjIjW4GlUZAMYd2vXMi3b3l2JHhJ4z3gJvS7rQKZk' })
  @ApiResponse({ status: 200, description: 'Detalhes completos da faixa', type: TrackDetailDto })
  async detail(@Param('id') id: string): Promise<TrackDetailDto> {
    return this.tracksService.detail(id);
  }

  @Get(':albumId/tracks')
  @ApiOperation({ summary: 'Faixas do álbum' })
  @ApiParam({ name: 'albumId', example: '4yP0hdKOZPNshxUOjY0cZj' })
  @ApiResponse({
    status: 200,
    description: 'Lista de faixas do álbum',
    type: [AlbumTrackDto],
  })
  async albumTracks(@Param('albumId') albumId: string): Promise<AlbumTrackDto[]> {
    return this.tracksService.getAlbumTracks(albumId);
  }
}
