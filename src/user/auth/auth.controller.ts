import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from '../dtos/register.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: registerDto) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: { email: string, password: string }) {
        return this.authService.login(body);
    }

    @Get('history')
    async getHistory() {
        return "ok"
    }

}
