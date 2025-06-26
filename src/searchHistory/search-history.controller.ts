import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiProperty,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryDto } from './dto/search-history.dto';
import { IsString } from 'class-validator';

class CreateSearchHistoryDto {
  @ApiProperty({ example: 'lofi beats', description: 'Termo buscado' })
  @IsString()
  query: string;
}

@ApiTags('search-history')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly service: SearchHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar meu histórico de busca' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    example: 0,
    description: 'Offset inicial da busca',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
    description: 'Máximo de itens (até 100)',
  })
  @ApiResponse({ status: 200, type: [SearchHistoryDto] })
  list(@Req() req, @Query('cursor') cursor = 0, @Query('limit') limit = 20) {
    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safeCursor = Number(cursor) || 0;
    return this.service.list(req.user.userId, safeLimit, safeCursor);
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

  @Post()
  @ApiOperation({ summary: 'Adicionar item ao histórico' })
  @ApiResponse({ status: 201, type: SearchHistoryDto })
  create(@Req() req, @Body() body: CreateSearchHistoryDto) {
    return this.service.record(req.user.userId, body.query);
  }
}