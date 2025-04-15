import { ApiProperty } from '@nestjs/swagger';

export class AlbumImageDto {
  @ApiProperty({ example: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...' }) url: string;
  @ApiProperty({ example: 640 }) width: number;
  @ApiProperty({ example: 640 }) height: number;
}

export class AlbumSummaryDto {
  @ApiProperty({ example: '0sNOF9WDwhWunNAHPD3Baj' }) id: string;
  @ApiProperty({ example: 'After Hours' }) name: string;
  @ApiProperty({ example: '2020-03-20' }) releaseDate: string;
  @ApiProperty({ example: 14 }) totalTracks: number;
  @ApiProperty({ type: [AlbumImageDto] }) images: AlbumImageDto[];
}
