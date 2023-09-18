import { IsNotEmpty, IsUUID, IsUrl } from "class-validator";

export default class transcriptionDto {

    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsUrl()
    videoUrl: string;

    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    text: string;
}