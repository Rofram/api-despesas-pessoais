import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'John Doe' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'JohnDoe@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'senhaSecreta' })
  password: string;
}
