import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() data: { text: string; token: string },
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const payload = this.jwtService.verify(data.token);
            const username = payload.username;

            this.server.emit('chatMessage', {
                username,
                text: data.text,
                timestamp: new Date().toISOString(),
            });
        } catch (e) {
            console.error('Invalid token in chat message');
            client.emit('error', 'Je moet ingelogd zijn om te chatten!');
        }
    }
}
