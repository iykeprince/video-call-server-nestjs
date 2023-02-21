import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RequestWithAuth } from "src/types";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get('/profile')
    getProfile(@Req() req: RequestWithAuth){
        console.log('profile req', req.user)
        return req.user;
    }
}