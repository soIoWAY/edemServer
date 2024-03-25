import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 12, { message: 'Username has to be at between 3 and 12 chars' })
  public username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 24, { message: 'Password has to be at between 6 and 24 chars' })
  public password: string;
}
