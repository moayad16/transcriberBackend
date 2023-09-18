import { Controller, Get, Headers, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly useService: UserService){}

    @Get("/finished_Transcriptions")
    async getUserHistory (@Req() request: Request) {
        if (!request['user']?.id) return [];
        return this.useService.getUserHistory(request['user']?.id)
    }

}
