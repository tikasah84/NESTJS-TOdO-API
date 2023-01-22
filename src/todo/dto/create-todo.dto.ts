import { IsEmail, IsNotEmpty ,IsString,Length} from 'class-validator';

export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    public title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    file: any;

    status: string;
}
