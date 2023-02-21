import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { Server } from "typeorm";
import { AppService } from "./app.service";
import { SocketWithAuth } from "./types";

interface VideoCallPayload { userId: string, signal: any, from: string, name: string }

@WebSocketGateway({
    namespace: '/video-call',
    cors: {
        origin: "*"
    }
})
export class VideoCallGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(VideoCallGateway.name);
    private users: {userId: string, email: string, socketId: string}[] = [];

    constructor(private appService: AppService){}

    @WebSocketServer() io: Namespace;

    afterInit(server: Server) {
        this.logger.log(`VideoGateway is initialized...`)
    }
    handleConnection(client: SocketWithAuth, ...args: any[]) {
        this.logger.log(`Client connected: user id ${client.user.id}`)
        this.logger.log(`client size: ${this.io.sockets.size}`)
        this.users.push({userId: client.user.id, email: client.user.email, socketId: client.id,})
        client.emit('me', {userId: client.user.id, email: client.user.email, socketId: client.id,})
        console.log('users', this.users)
    }

    @SubscribeMessage('callUser')
    async handleCallUser(client: SocketWithAuth, payload: VideoCallPayload){

        const user = this.users.find((user) => user.userId === payload.userId)
        console.log('call user', user)
        this.io.to(user.socketId).emit('callUser', payload)
        return user;
    }

    @SubscribeMessage('answerCall')
    handleAnswerCall(client: SocketWithAuth, payload: VideoCallPayload) {
        const user = this.users.find((user)=>user.userId === payload.from)
        console.log('answer call', user)
        this.io.to(user.socketId).emit('callAccepted',  payload.signal)
        return user;
    }

    handleDisconnect(client: any) {
        this.logger.log(`Client disconnected: ${client.id}`)
        this.logger.log(`client size: ${this.io.sockets.size}`)
        const availableUsers = this.users.filter((user) => user.userId !== client.user.id)
        this.users = availableUsers;
        console.log('users', this.users)
    }
}