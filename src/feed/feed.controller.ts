import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { PublicFeedDto } from './dto/public-feed.dto';
import { PlatformStatsDto } from './dto/platform-stats.dto';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('public')
  @ApiOperation({ 
    summary: 'Feed público para landing page',
    description: 'Atividades recentes da plataforma (reviews, favoritos, playlists) para exibir na página inicial'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    example: 10,
    description: 'Número de atividades a retornar (máximo 50)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de atividades recentes da plataforma',
    type: [PublicFeedDto]
  })
  async getPublicFeed(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const safeLimit = Math.min(limit || 10, 50);
    return this.feedService.getPublicFeed(safeLimit);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Estatísticas da plataforma',
    description: 'Números gerais da plataforma para exibir na landing page'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas gerais da plataforma',
    type: PlatformStatsDto
  })
  async getPlatformStats() {
    return this.feedService.getPlatformStats();
  }
}
