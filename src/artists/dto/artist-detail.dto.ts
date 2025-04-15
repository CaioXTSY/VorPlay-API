import { ApiProperty } from '@nestjs/swagger';
import { AlbumSummaryDto } from './album-summary.dto';
import { TrackSummaryDto } from 'src/tracks/dto/track-summary.dto';

export class ArtistDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String] })
  genres: string[];

  @ApiProperty({ description: 'Número de seguidores' })
  followers: number;

  @ApiProperty({ description: 'Popularidade (0–100)' })
  popularity: number;

  @ApiProperty({ description: 'URL externa no Spotify' })
  externalUrl: string;

  @ApiProperty({ type: [AlbumSummaryDto] })
  albums: AlbumSummaryDto[];

  @ApiProperty({ type: [TrackSummaryDto] })
  topTracks: TrackSummaryDto[];
}
