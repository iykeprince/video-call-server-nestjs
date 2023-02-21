import { Body, Controller, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService ){}

    @Post('register')
    registerUser(@Body() body: CreateUserDto){
        return this.authService.createUser(body);
    }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body)
    }

}