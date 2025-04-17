import { ApiProperty } from '@nestjs/swagger';

export class SearchHistoryDto {
  @ApiProperty({ example: 7 }) id: number;
  @ApiProperty({ example: 3 }) userId: number;
  @ApiProperty({ example: 'lofi beats' }) query: string;
  @ApiProperty({ example: '2025-04-17T12:00:00.000Z' }) createdAt: Date;
}