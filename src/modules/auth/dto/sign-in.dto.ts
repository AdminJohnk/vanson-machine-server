import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
export class SignInDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
