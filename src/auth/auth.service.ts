import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async createUser(body: CreateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (foundUser) {
      throw new ForbiddenException('user with this email already exists');
    }

    const user = await this.userRepository.save(body);
    const access_token = this.jwtService.sign({username: user.username, sub: user.id, email: user.email});

    return {
        access_token,
        user,
    }
  }

  async login(body: LoginDto) {
    const user = await this.userRepository.findOne({where: {email: body.email, password: body.password}})
    
    if(!user) {
        throw new NotFoundException("Invalid login")
    }
    
    const access_token = this.jwtService.sign({username: user.username, sub: user.id, email: user.email});

    return {
        access_token,
        user,
    }
  }
}
