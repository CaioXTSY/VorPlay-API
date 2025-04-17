import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
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
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowDto } from './dto/follow.dto';

@ApiTags('follows')
@Controller('follows')
export class FollowsController {
  constructor(private readonly service: FollowsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Listar quem EU sigo' })
  listMine(@Req() req) {
    return this.service.listByUser(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Seguir usuário' })
  @ApiResponse({ status: 201, type: FollowDto })
  create(@Req() req, @Body() dto: CreateFollowDto) {
    return this.service.create(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Deixar de seguir (pelo id)' })
  @ApiParam({ name: 'id', example: 7 })
  remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(req.user.userId, id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Listar quem um usuário segue (público)' })
  @ApiParam({ name: 'id', example: 12 })
  listForUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.listForUser(id);
  }
}