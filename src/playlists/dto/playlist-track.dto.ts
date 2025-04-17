import { ApiProperty } from '@nestjs/swagger';

export class PlaylistTrackDto {
  @ApiProperty({ example: 1 }) playlistId: number;
  @ApiProperty({ example: 42 }) trackId: number;
  @ApiProperty({ example: 1 }) position: number;
}
