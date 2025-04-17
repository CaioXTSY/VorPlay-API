import { ApiProperty } from '@nestjs/swagger';
import { PlaylistTrackDto } from './playlist-track.dto';
import { TrackDto } from './track.dto';

export class PlaylistTrackWithDataDto extends PlaylistTrackDto {
  @ApiProperty({ type: () => TrackDto })
  track: TrackDto;
}
