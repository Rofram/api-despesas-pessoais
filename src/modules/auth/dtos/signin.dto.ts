import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'JohnDoe@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'senhaSecreta' })
  password: string;
}
