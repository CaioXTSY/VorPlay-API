import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiNoContentResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar review de uma faixa pelo Spotify ID' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review criado.', type: ReviewDto })
  @ApiBadRequestResponse({ description: 'Payload inválido.' })
  async add(
    @Req() req,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewDto> {
    const raw = req.user as any;
    const userId = Number(raw.id ?? raw.sub ?? raw.userId);
    if (!userId) {
      throw new BadRequestException('UserId inválido');
    }

    const rev = await this.reviewsService.add(
      userId,
      dto.id,
      dto.rating,
      dto.comment,
    );

    return {
      id: rev.id,
      trackId: rev.track.id,
      externalId: rev.track.externalId,
      title: rev.track.title,
      artist: rev.track.artist,
      album: rev.track.album,
      coverUrl: rev.track.coverUrl,
      rating: rev.rating,
      comment: rev.comment,
      userId: rev.user.id,
      userName: rev.user.name,
      createdAt: rev.createdAt,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar reviews do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de reviews do usuário autenticado.', type: [ReviewDto] })
  @ApiBadRequestResponse({ description: 'UserId inválido.' })
  async listOwn(@Req() req): Promise<ReviewDto[]> {
    const raw = req.user as any;
    const userId = Number(raw.id ?? raw.sub ?? raw.userId);
    if (!userId) {
      throw new BadRequestException('UserId inválido');
    }
    const revs = await this.reviewsService.listByUser(userId);
    return revs.map(r => ({
      id: r.id,
      trackId: r.track.id,
      externalId: r.track.externalId,
      title: r.track.title,
      artist: r.track.artist,
      album: r.track.album,
      coverUrl: r.track.coverUrl,
      rating: r.rating,
      comment: r.comment,
      userId: r.user.id,
      userName: r.user.name,
      createdAt: r.createdAt,
    }));
  }

  @Delete(':reviewId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover review próprio' })
  @ApiParam({ name: 'reviewId', type: 'integer', description: 'ID interno do review' })
  @ApiNoContentResponse({ description: 'Review removido.' })
  async remove(
    @Req() req,
    @Param('reviewId') reviewId: string,
  ) {
    const raw = req.user as any;
    const userId = Number(raw.id ?? raw.sub ?? raw.userId);
    if (!userId) {
      throw new BadRequestException('UserId inválido');
    }
    await this.reviewsService.remove(userId, Number(reviewId));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar reviews de um usuário por ID interno' })
  @ApiParam({ name: 'userId', type: 'integer', description: 'ID interno do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de reviews do usuário.', type: [ReviewDto] })
  @ApiBadRequestResponse({ description: 'UserId inválido.' })
  async listByUser(@Param('userId') userId: string): Promise<ReviewDto[]> {
    const id = Number(userId);
    if (!id) {
      throw new BadRequestException('UserId inválido');
    }
    const revs = await this.reviewsService.listByUser(id);
    return revs.map(r => ({
      id: r.id,
      trackId: r.track.id,
      externalId: r.track.externalId,
      title: r.track.title,
      artist: r.track.artist,
      album: r.track.album,
      coverUrl: r.track.coverUrl,
      rating: r.rating,
      comment: r.comment,
      userId: r.user.id,
      userName: r.user.name,
      createdAt: r.createdAt,
    }));
  }

  @Get('track/:externalId')
  @ApiOperation({ summary: 'Listar reviews de uma faixa pelo Spotify ID' })
  @ApiParam({ name: 'externalId', description: 'ID da faixa no Spotify' })
  @ApiResponse({ status: 200, description: 'Lista de reviews da faixa.', type: [ReviewDto] })
  @ApiBadRequestResponse({ description: 'Spotify ID inválido.' })
  @ApiResponse({ status: 404, description: 'Nenhum review encontrado para essa faixa.' })
  async listBySpotifyId(@Param('externalId') externalId: string): Promise<ReviewDto[]> {
    if (!externalId) {
      throw new BadRequestException('É necessário informar o Spotify ID da faixa');
    }

    const track = await this.reviewsService.getTrackByExternalId(externalId);
    const revs = await this.reviewsService.listByTrack(track.id);

    if (revs.length === 0) {
      throw new NotFoundException(`Nenhum review encontrado para a faixa (Spotify ID: ${externalId})`);
    }

    return revs.map(r => ({
      id: r.id,
      trackId: r.track.id,
      externalId: r.track.externalId,
      title: r.track.title,
      artist: r.track.artist,
      album: r.track.album,
      coverUrl: r.track.coverUrl,
      rating: r.rating,
      comment: r.comment,
      userId: r.user.id,
      userName: r.user.name,
      createdAt: r.createdAt,
    }));
  }
}
