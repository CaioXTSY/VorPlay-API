import { Controller, Get } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return { message: 'GET all favorites endpoint stub' };
  }
}
