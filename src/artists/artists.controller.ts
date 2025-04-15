import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistSummaryDto } from './dto/artist-summary.dto';
import { ArtistInfoDto } from './dto/artist-info.dto';
import { AlbumSummaryDto } from './dto/album-summary.dto';
import { TrackSummaryDto } from '../tracks/dto/track-summary.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar artistas', description: 'Lista artistas pelo termo informado.' })
  @ApiQuery({ name: 'query', required: true, example: 'space laces' })
  @ApiResponse({
    status: 200,
    description: 'Lista de artistas resumidos',
    type: [ArtistSummaryDto],
    examples: {
      'application/json': {
        summary: 'Exemplo de resposta de busca de artistas',
        value: [
          {
            id: '37PZXblQTqpEWGdjctNcGP',
            name: 'Space Laces',
            externalUrl: 'https://open.spotify.com/artist/37PZXblQTqpEWGdjctNcGP',
            imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb19c2790744c792d05570bb71'
          }
        ]
      }
    }
  })
  async search(@Query('query') query: string): Promise<ArtistSummaryDto[]> {
    if (!query) throw new NotFoundException('Parâmetro "query" é obrigatório.');
    return this.artistsService.searchSummaries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Info básica do artista', description: 'Retorna dados principais do artista.' })
  @ApiParam({ name: 'id', example: '37PZXblQTqpEWGdjctNcGP' })
  @ApiResponse({
    status: 200,
    description: 'Informações básicas do artista',
    type: ArtistInfoDto,
    examples: {
      'application/json': {
        summary: 'Exemplo de resposta de detalhes do artista',
        value: {
          id: '37PZXblQTqpEWGdjctNcGP',
          name: 'Space Laces',
          genres: ['dubstep', 'riddim'],
          followers: 109566,
          popularity: 56,
          externalUrl: 'https://open.spotify.com/artist/37PZXblQTqpEWGdjctNcGP',
          images: [
            { url: 'https://i.scdn.co/image/ab6761610000e5eb19c2790744c792d05570bb71', width: 640, height: 640 }
          ]
        }
      }
    }
  })
  async detail(@Param('id') id: string): Promise<ArtistInfoDto> {
    return this.artistsService.findDetail(id);
  }

  @Get(':id/albums')
  @ApiOperation({ summary: 'Álbuns do artista', description: 'Retorna lista de álbuns de um artista.' })
  @ApiParam({ name: 'id', example: '37PZXblQTqpEWGdjctNcGP' })
  @ApiResponse({
    status: 200,
    description: 'Álbuns do artista',
    type: [AlbumSummaryDto],
    examples: {
      'application/json': {
        summary: 'Exemplo de resposta de álbuns do artista',
        value: [
          {
            id: '0sNOF9WDwhWunNAHPD3Baj',
            name: 'After Hours',
            releaseDate: '2020-03-20',
            totalTracks: 14,
            images: [
              { url: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...', width: 640, height: 640 }
            ]
          }
        ]
      }
    }
  })
  async albums(@Param('id') id: string): Promise<AlbumSummaryDto[]> {
    return this.artistsService.getAlbums(id);
  }

  @Get(':id/top-tracks')
  @ApiOperation({ summary: 'Top‑tracks do artista', description: 'Retorna faixas mais populares do artista.' })
  @ApiParam({ name: 'id', example: '37PZXblQTqpEWGdjctNcGP' })
  @ApiResponse({
    status: 200,
    description: 'Top‑tracks do artista',
    type: [TrackSummaryDto],
    examples: {
      'application/json': {
        summary: 'Exemplo de resposta de top‑tracks do artista',
        value: [
          {
            id: '0VjIjW4GlUZAMYd2vXMi3b',
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
  async topTracks(@Param('id') id: string): Promise<TrackSummaryDto[]> {
    return this.artistsService.getTopTracks(id);
  }
}
