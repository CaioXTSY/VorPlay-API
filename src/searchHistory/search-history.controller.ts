import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryDto } from './dto/search-history.dto';

@ApiTags('search-history')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly service: SearchHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar meu histórico de busca' })
  @ApiResponse({ status: 200, type: [SearchHistoryDto] })
  list(@Req() req) {
    return this.service.list(req.user.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Limpar TODO o histórico' })
  clear(@Req() req) {
    return this.service.clearAll(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover item específico' })
  @ApiParam({ name: 'id', example: 12 })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(req.user.userId, id);
  }
}