import { IsString } from "class-validator";

export class CreateChat {
    @IsString()
    email: string;

    @IsString()
    text: string;
}