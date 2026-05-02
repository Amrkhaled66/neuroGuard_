import { formEnum } from 'src/db';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(formEnum.enumValues)
  @IsNotEmpty()
  form!: typeof formEnum.enumValues[number];
}
