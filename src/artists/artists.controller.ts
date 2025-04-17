import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ArtistsService }        from './artists.service';
import { ArtistSummaryDto }      from './dto/artist-summary.dto';
import { ArtistInfoDto }         from './dto/artist-info.dto';
import { AlbumSummaryDto }       from './dto/album-summary.dto';
import { TrackSummaryDto }       from '../tracks/dto/track-summary.dto';
import { ArtistCursorPageDto }   from './dto/artist-cursor-page.dto';
import { CursorPaginationDto }   from '../common/dto/cursor-pagination.dto';
import {
  ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam,
} from '@nestjs/swagger';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar artistas', description: 'Pesquisa artistas cursor‑based numérico.' })
  @ApiQuery({ name: 'query',  required: true,  example: 'space laces' })
  @ApiQuery({ name: 'cursor', required: false, example: 0 })
  @ApiQuery({ name: 'limit',  required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Página de artistas resumidos',
    type: ArtistCursorPageDto,
  })
  async search(
    @Query('query') query: string,
    @Query() { cursor = 0, limit }: CursorPaginationDto,
  ): Promise<ArtistCursorPageDto> {
    if (!query) {
      throw new NotFoundException('Parâmetro "query" é obrigatório.');
    }
    return this.artistsService.searchSummaries(query, limit, cursor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do artista' })
  @ApiParam({ name: 'id', example: '37PZXblQTqpEWGdjctNcGP' })
  @ApiResponse({ status: 200, description: 'Informações detalhadas do artista', type: ArtistInfoDto })
  async info(@Param('id') id: string): Promise<ArtistInfoDto> {
    return this.artistsService.getInfo(id);
  }

  @Get(':id/albums')
  @ApiOperation({ summary: 'Álbuns do artista' })
  @ApiParam({ name: 'id', example: '37PZXblQTqpEWGdjctNcGP' })
  @ApiResponse({ status: 200, description: 'Lista de álbuns', type: [AlbumSummaryDto] })
  async albums(@Param('id') id: string): Promise<AlbumSummaryDto[]> {
    return this.artistsService.getAlbums(id);
  }

  @Get(':id/top-tracks')
  @ApiOperation({ summary: 'Top tracks do artista' })
  @ApiParam({ name: 'id', example: '37PZXblQTqpEWGdjctNcGP' })
  @ApiResponse({ status: 200, description: 'Top faixas', type: [TrackSummaryDto] })
  async topTracks(@Param('id') id: string): Promise<TrackSummaryDto[]> {
    return this.artistsService.getTopTracks(id);
  }
}
