import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from './types';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options: ServerOptions) {
    const cors = {
      origin: ['*'],
    };

    this.logger.log(`Configuring SocketIO server with custom CORS options`, {
      cors,
    });

    const optionWithCors: ServerOptions = {
      ...options,
      cors,
    };

    const configService = this.app.get(ConfigService)
    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionWithCors);
    //register the namespaces that needs to be authenticated
    server.of('chat').use(createTokenMiddleware(jwtService, configService, this.logger));
    server.of('video-call').use(createTokenMiddleware(jwtService, configService, this.logger))
    return server;
  }
}

const createTokenMiddleware = (jwtService: JwtService, configService: ConfigService, logger: Logger) => (
  socket: SocketWithAuth,
  next,
) => {
  const token =
    socket.handshake.auth.token || socket.handshake.headers['authorization'];

  logger.debug(`Validating auth token before connection: ${token}`);
  try {
    const payload = jwtService.verify(token, {secret: configService.get('JWT_SECRET')});
    console.log(payload,'payload')
    socket.user = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch {
    next(new Error('FORBIDDEN'));
  }
};
