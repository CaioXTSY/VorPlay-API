import { Controller, Get } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('follows')
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get()
  getAllFollows() {
    return { message: 'GET all follows endpoint stub' };
  }
}
