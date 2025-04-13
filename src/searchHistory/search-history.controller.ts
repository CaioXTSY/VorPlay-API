import { Controller, Get } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('search-history')
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  @Get()
  getAllSearchHistory() {
    return { message: 'GET all search history endpoint stub' };
  }
}
