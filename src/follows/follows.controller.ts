import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowDto } from './dto/follow.dto';
import { FollowTargetType } from '@prisma/client';

@ApiTags('follows')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller()
export class FollowsController {
  constructor(private readonly service: FollowsService) {}

  /* ---- Eu sigo ---- */

  @Get('follows')
  @ApiOperation({ summary: 'Listar todos que eu sigo' })
  listMine(@Req() req) {
    return this.service.listByUser(req.user.userId);
  }

  @Get('follows/type/:type')
  @ApiOperation({ summary: 'Listar que eu sigo por tipo' })
  @ApiParam({ name: 'type', enum: FollowTargetType })
  listMineByType(
    @Req() req,
    @Param('type') type: FollowTargetType,
  ) {
    return this.service.listByUser(req.user.userId, type);
  }

  @Get('follows/check')
  @ApiOperation({ summary: 'Checar se já sigo' })
  @ApiQuery({ name: 'targetType', enum: FollowTargetType })
  @ApiQuery({ name: 'targetId', example: 42 })
  async checkMine(
    @Req() req,
    @Query('targetType') tt: FollowTargetType,
    @Query('targetId', ParseIntPipe) tid: number,
  ) {
    const found = await this.service.isFollowing(req.user.userId, tt, tid);
    return { following: !!found, followId: found?.id };
  }

  @Post('follows')
  @ApiOperation({ summary: 'Seguir alguém / artista' })
  @ApiResponse({ status: 201, type: FollowDto })
  create(@Req() req, @Body() dto: CreateFollowDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Delete('follows/:id')
  @ApiOperation({ summary: 'Deixar de seguir (pelo id)' })
  @ApiParam({ name: 'id', example: 7 })
  async remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.service.remove(req.user.userId, id);
  }

  /* ---- Outro usuário segue ---- */

  @Get('follows/user/:id')
  @ApiOperation({ summary: 'Listar quem um usuário segue' })
  @ApiParam({ name: 'id', example: 12 })
  @ApiQuery({ name: 'targetType', enum: FollowTargetType, required: false })
  listByOther(
    @Param('id', ParseIntPipe) id: number,
    @Query('targetType') type?: FollowTargetType,
  ) {
    return this.service.listByUser(id, type);
  }

  /* ---- Quem me segue ---- */

  @Get('followers')
  @ApiOperation({ summary: 'Listar quem me segue' })
  listFollowers(@Req() req) {
    return this.service.listFollowersOfUser(req.user.userId);
  }
}
