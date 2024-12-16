import { ApiProperty } from '@nestjs/swagger';

export class MonthlyDto {
  @ApiProperty({
    example: 2024,
  })
  year: number;
  @ApiProperty({
    example: 10,
  })
  month: number;
}
