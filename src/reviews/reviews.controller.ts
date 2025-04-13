import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getAllReviews() {
    return { message: 'GET all reviews endpoint stub' };
  }
}
