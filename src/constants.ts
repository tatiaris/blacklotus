import * as socketio from 'socket.io';

export const socketioConfig: Partial<socketio.ServerOptions> = {
  pingInterval: 1000,
  pingTimeout: 1000,
  cors: {
      origin: ["https://boardgames-rho.vercel.app", "http://localhost:3000"],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
  }
}