import { IsNotEmpty, IsString } from "class-validator";

export class FaqDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}