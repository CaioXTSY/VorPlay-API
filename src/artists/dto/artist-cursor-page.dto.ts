import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArtistSummaryDto } from './artist-summary.dto';

export class ArtistCursorPageDto {
  @ApiProperty({ type: [ArtistSummaryDto], description: 'Itens retornados nesta página.' })
  items: ArtistSummaryDto[];

  @ApiPropertyOptional({
    description: 'Cursor (offset) para próxima página.',
    example: 30,
  })
  nextCursor?: number;
}
