import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TrackSummaryDto } from './dto/track-summary.dto';
import { TrackDetailDto } from './dto/track-detail.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar faixas', description: 'Retorna lista resumida de faixas para o termo informado.' })
  @ApiQuery({ name: 'query', required: true, description: 'Termo de busca' })
  @ApiResponse({ status: 200, type: [TrackSummaryDto] })
  async search(
    @Query('query') query: string
  ): Promise<TrackSummaryDto[]> {
    if (!query) {
      throw new NotFoundException('Parâmetro "query" é obrigatório.');
    }
    return this.tracksService.searchSummaries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes da faixa', description: 'Retorna todos os detalhes de uma faixa pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID da faixa' })
  @ApiResponse({ status: 200, type: TrackDetailDto })
  async findOne(
    @Param('id') id: string
  ): Promise<TrackDetailDto> {
    return this.tracksService.findDetail(id);
  }
}
