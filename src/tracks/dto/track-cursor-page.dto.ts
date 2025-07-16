import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackSummaryDto } from './track-summary.dto';

export class TrackCursorPageDto {
  @ApiProperty({ type: [TrackSummaryDto], description: 'Itens retornados nesta página.' })
  items: TrackSummaryDto[];

  @ApiPropertyOptional({
    description: 'Cursor (offset) para próxima página.',
    example: 20,
  })
  nextCursor?: number;
}
