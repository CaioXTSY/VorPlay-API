import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { SearchTracksDto } from './dto/search-tracks.dto';
import { TrackDto } from './dto/track.dto';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @ApiOperation({ summary: 'Buscar faixas por termo' })
  @ApiResponse({ status: 200, description: 'Lista de faixas encontradas', type: [TrackDto] })
  @Get()
  async search(@Query() dto: SearchTracksDto): Promise<TrackDto[]> {
    return this.tracksService.searchTracks(dto.query);
  }

  @ApiOperation({ summary: 'Obter detalhes de uma faixa' })
  @ApiParam({ name: 'id', example: '3135556', description: 'ID da faixa a ser consultada' })
  @ApiResponse({ status: 200, description: 'Detalhes da faixa', type: TrackDto })
  @Get(':id')
  async detail(@Param('id') id: string): Promise<TrackDto> {
    return this.tracksService.getTrackDetails(id);
  }
}
