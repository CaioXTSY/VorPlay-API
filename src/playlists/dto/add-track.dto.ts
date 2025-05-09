import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ExternalProvider } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AddTrackDto {
  @ApiProperty({ example: '0VjIjW4GlUZAMYd2vXMi3b3l2JHhJ4z3gJvS7rQKZk' })
  @IsString()
  externalId: string;

  @ApiProperty({ enum: ExternalProvider, example: ExternalProvider.Spotify })
  @IsEnum(ExternalProvider)
  externalProvider: ExternalProvider;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  position?: number;
}