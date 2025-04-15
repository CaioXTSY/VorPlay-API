import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TrackSummaryDto } from './dto/track-summary.dto';
import { TrackDetailDto } from './dto/track-detail.dto';
import { AlbumTrackDto } from './dto/album-track.dto';
import {
  ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam,
} from '@nestjs/swagger';

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar faixas', description: 'Pesquisa faixas pelo termo informado.' })
  @ApiQuery({ name: 'query', required: true, example: 'blinding lights' })
  @ApiResponse({
    status: 200,
    description: 'Lista de faixas resumidas',
    type: [TrackSummaryDto],
    examples: {
      'application/json': {
        summary: 'Exemplo de resposta de search',
        value: [
          {
            id: '6J3l2JHhJ4z3gJvS7rQKZk',
            title: 'Blinding Lights',
            artistNames: ['The Weeknd'],
            albumName: 'After Hours',
            durationMs: 200040,
            href: 'https://api.spotify.com/v1/tracks/6J3l2JHhJ4z3gJvS7rQKZk'
          }
        ]
      }
    }
  })
  async search(@Query('query') query: string): Promise<TrackSummaryDto[]> {
    if (!query) throw new NotFoundException('Parâmetro "query" é obrigatório.');
    return this.tracksService.searchSummaries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes da faixa', description: 'Retorna todos os detalhes de uma faixa pelo ID.' })
  @ApiParam({ name: 'id', example: '6J3l2JHhJ4z3gJvS7rQKZk' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes completos da faixa',
    type: TrackDetailDto,
    examples: {
      'application/json': {
        summary: 'Exemplo de resposta de detail',
        value: {
          id: '6J3l2JHhJ4z3gJvS7rQKZk',
          title: 'Blinding Lights',
          artists: [
            { id: '1Xyo4u8uXC1ZmMpatF05PJ', name: 'The Weeknd', externalUrl: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' }
          ],
          album: {
            id: '0sNOF9WDwhWunNAHPD3Baj',
            name: 'After Hours',
            releaseDate: '2020-03-20',
            totalTracks: 14,
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...', width: 640, height: 640 }]
          },
          durationMs: 200040,
          popularity: 95,
          genres: ['pop', 'r&b'],
          embed: 'https://open.spotify.com/embed/track/6J3l2JHhJ4z3gJvS7rQKZk',
          href: 'https://api.spotify.com/v1/tracks/6J3l2JHhJ4z3gJvS7rQKZk'
        }
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<TrackDetailDto> {
    return this.tracksService.findDetail(id);
  }

  @Get('album/:id/tracks')
  @ApiOperation({ summary: 'Faixas de um álbum', description: 'Retorna todas as faixas de um álbum pelo seu ID.' })
  @ApiParam({ name: 'id', example: '0sNOF9WDwhWunNAHPD3Baj' })
  @ApiResponse({
    status: 200,
    description: 'Lista de faixas do álbum com metadados completos',
    type: [AlbumTrackDto],
    examples: {
      'application/json': {
        summary: 'Exemplo de resposta de album tracks',
        value: [
          {
            id: '6J3l2JHhJ4z3gJvS7rQKZk',
            title: 'Blinding Lights',
            trackNumber: 1,
            durationMs: 200040,
            artists: [
              { id: '1Xyo4u8uXC1ZmMpatF05PJ', name: 'The Weeknd', externalUrl: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' }
            ],
            album: {
              id: '0sNOF9WDwhWunNAHPD3Baj',
              name: 'After Hours',
              coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...',
              releaseDate: '2020-03-20'
            }
          }
        ]
      }
    }
  })
  async byAlbum(@Param('id') id: string): Promise<AlbumTrackDto[]> {
    return this.tracksService.findByAlbum(id);
  }
}
