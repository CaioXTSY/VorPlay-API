import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TrackDto } from './dto/track.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search tracks by query', description: 'Pesquisa faixas com base no termo enviado na query.' })
  @ApiQuery({ name: 'query', required: true, description: 'Termo de busca para pesquisar as faixas' })
  @ApiResponse({ status: 200, description: 'Lista de faixas retornada com sucesso.', type: [TrackDto] })
  async searchTracks(@Query('query') query: string): Promise<TrackDto[]> {
    if (!query) {
      throw new NotFoundException('O parâmetro "query" é obrigatório para a busca.');
    }
    return await this.tracksService.searchTracks(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track details', description: 'Retorna detalhes completos da faixa com base no ID informado.' })
  @ApiParam({ name: 'id', required: true, description: 'Identificador único da faixa' })
  @ApiResponse({ status: 200, description: 'Detalhes da faixa retornados com sucesso.', type: TrackDto })
  async getTrackDetails(@Param('id') id: string): Promise<TrackDto> {
    return await this.tracksService.getTrackDetails(id);
  }
}