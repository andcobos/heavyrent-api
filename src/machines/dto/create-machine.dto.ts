import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bulldozer', description: 'Type of heavy equipment' })
  name: string;

  @IsString()
  @MinLength(10)
  @ApiProperty({ 
    example: 'Wheel Loader', 
    description: 'Type of construction machine' 
    }) 
    description: string;
}