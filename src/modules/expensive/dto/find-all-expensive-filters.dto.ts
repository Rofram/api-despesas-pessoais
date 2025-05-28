import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class FindAllExpensiveFiltersDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  category: string;

  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ required: false })
  amount: number;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({ required: false })
  date: Date;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ required: false, default: 1 })
  page: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ required: false, default: 10 })
  limit: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'amount.desc' })
  sortBy: string;
}