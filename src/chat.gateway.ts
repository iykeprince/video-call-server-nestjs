import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Server, Socket } from "socket.io";
import { AppService } from "./app.service";
import { CreateChat } from "./create-chat.dto";
import { Chat } from "./entities";
import { SocketWithAuth } from "./types";

@UsePipes(new ValidationPipe())
@WebSocketGateway({
    namespace: '/chat',
    cors: {
        origin: "*"
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);
    constructor(private appService: AppService){}

    @WebSocketServer() io: Namespace;

    afterInit(server: Server) {
        this.logger.log(`ChatGateway is initialized...`)
    }
    handleConnection(client: SocketWithAuth, ...args: any[]) {
        this.logger.log(`Client connected: user id ${client.user.id}`)
        this.logger.log(`client size: ${this.io.sockets.size}`)
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: string){
        // await this.appService.sendMessage(payload)
        this.io.emit('recMessage', payload)
    }

    handleDisconnect(client: any) {
        this.logger.log(`Client disconnected: ${client.id}`)
        this.logger.log(`client size: ${this.io.sockets.size}`)
    }
}