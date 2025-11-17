import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

