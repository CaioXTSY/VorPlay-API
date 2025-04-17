import { ApiProperty } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty({ example: 42 }) id: number;
  @ApiProperty({ example: '6J3l2JHhJ4z3gJvS7rQKZk' }) externalId: string;
  @ApiProperty({ example: 'Blinding Lights' }) title: string;
  @ApiProperty({ example: 'The Weeknd' }) artist: string;
  @ApiProperty({ example: 'After Hours' }) album: string;
  @ApiProperty({ example: 'https://i.scdn.co/image/…', required: false }) coverUrl?: string;
}
