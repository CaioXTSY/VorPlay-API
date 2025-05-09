import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackSummaryDto } from '../../tracks/dto/track-summary.dto';

export class ArtistTrackCursorPageDto {
  @ApiProperty({ type: [TrackSummaryDto], description: 'Itens retornados nesta página.' })
  items: TrackSummaryDto[];

  @ApiPropertyOptional({ description: 'Cursor (offset) para próxima página.', example: 20 })
  nextCursor?: number;
}