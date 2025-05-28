import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateExpensiveDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}
