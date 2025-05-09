import { ApiProperty } from '@nestjs/swagger';

export class AlbumImageDto {
  @ApiProperty({ example: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...' })
  url: string;

  @ApiProperty({ example: 640 })
  width: number;

  @ApiProperty({ example: 640 })
  height: number;
}
