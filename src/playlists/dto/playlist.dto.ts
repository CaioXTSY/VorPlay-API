import { ApiProperty } from '@nestjs/swagger';
import { PlaylistTrackWithDataDto } from './playlist-track-with-data.dto';

export class PlaylistDto {
  @ApiProperty() id: number;
  @ApiProperty() userId: number;
  @ApiProperty() name: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  @ApiProperty({ type: () => [PlaylistTrackWithDataDto] })
  playlistTracks: PlaylistTrackWithDataDto[];
}
