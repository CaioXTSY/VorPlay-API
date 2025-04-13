import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { TracksService } from './tracks.service';

class SearchDto {
  @ApiProperty({ example: 'Beatles' })
  query: string;
}

class TrackDto {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty() artist: string;
  @ApiProperty() coverUrl: string;
  @ApiProperty() embedUrl: string;
}

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly svc: TracksService) {}

  @ApiOperation({ summary: 'Buscar faixas por termo' })
  @ApiResponse({ status: 200, type: [TrackDto] })
  @Get()
  search(@Query('query') query: string) {
    return this.svc.searchTracks(query);
  }

  @ApiOperation({ summary: 'Detalhes de uma faixa' })
  @ApiResponse({ status: 200, type: TrackDto })
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.svc.getTrackDetails(id);
  }
}
