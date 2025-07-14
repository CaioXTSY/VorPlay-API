import { ApiProperty } from '@nestjs/swagger';

export class PlatformStatsDto {
  @ApiProperty({ example: 1250, description: 'Total de usuários registrados' })
  totalUsers: number;

  @ApiProperty({ example: 3450, description: 'Total de reviews criados' })
  totalReviews: number;

  @ApiProperty({ example: 8900, description: 'Total de faixas favoritadas' })
  totalFavorites: number;

  @ApiProperty({ example: 567, description: 'Total de playlists criadas' })
  totalPlaylists: number;

  @ApiProperty({ example: 15, description: 'Número de faixas top rated' })
  topRatedTracks: number;

  @ApiProperty({ example: 20, description: 'Número de usuários mais ativos' })
  mostActiveUsers: number;
}
