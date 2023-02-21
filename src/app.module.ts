import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { Chat, UserEntity } from './entities';
import { UserModule } from './user/user.module';
import { VideoCallGateway } from './video-call.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres", 
        url:  config.get("POSTGRES_URL"),
        entities: [
     UserEntity,
     Chat
        ],
        synchronize: true,

      })
    }),
    TypeOrmModule.forFeature([Chat]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, VideoCallGateway],
})
export class AppModule {}
