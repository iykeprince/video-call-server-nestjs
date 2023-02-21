import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChat } from './create-chat.dto';
import { Chat } from './entities';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Chat) private chatRepository: Repository<Chat>,){}

  async sendMessage(payload: CreateChat) {
    return await this.chatRepository.save(payload)
  }

  async getMessages(): Promise<Chat[]> {
    return await this.chatRepository.find()
  }

  getHello(): string {
    return 'Hello World!';
  }
}
