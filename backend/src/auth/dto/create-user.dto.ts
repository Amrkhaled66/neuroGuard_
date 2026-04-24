import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';
  import { rolesEnum } from 'src/db/schemas/users.schema';
  
  export class SignupUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  
    @IsEnum(rolesEnum.enumValues)
    role: (typeof rolesEnum.enumValues)[number];
  }