import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUserRequestDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
