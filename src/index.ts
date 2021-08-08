import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import { Admin } from './classes/admin';
import { socketioConfig } from './constants';
import { handle_create_room, handle_disconnect, handle_join_room, handle_kick_player, handle_message, handle_start_game, handle_update_username } from './functions/general';

const port: number = parseInt(process.env.PORT || '8888', 10);
const admin = new Admin();
const app: Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, socketioConfig);
io.attach(server);

app.get('/ping', async (_: Request, res: Response) => {
    res.send('pong')
});

io.on('connection', (socket: socketio.Socket) => {
    // GENERAL Connections
    socket.on('create_room', (gameId: string) => handle_create_room(gameId, socket, admin));
    socket.on('join_room', (param) => handle_join_room(param, io, socket, admin));
    socket.on('message', (param) => handle_message(param, io));
    socket.on('update_username', (param) => handle_update_username(param, io, socket, admin));
    socket.on('kick_player', (param) => handle_kick_player(param, io, socket, admin));
    socket.on('disconnect', () => handle_disconnect(io, socket, admin));

    // GAME Connections
    socket.on('start_game', (param: any) => handle_start_game(param, io, admin));
});

server.listen(port, () => { console.log(`> Ready on http://localhost:${port}`) });
