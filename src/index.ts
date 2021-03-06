import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import { Admin } from './classes/admin';
import { socketioConfig } from './constants';
import { handle_create_room, handle_disconnect, handle_end_game, handle_join_room, handle_kick_user, handle_message, handle_player_action, handle_private_data_request, handle_start_game, handle_update_username } from './functions/general';

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
    socket.on('kick_user', (param) => handle_kick_user(param, io, socket, admin));
    socket.on('disconnect', () => handle_disconnect(io, socket, admin));

    // GAME Connections
    socket.on('start_game', (param) => handle_start_game(param, io, admin));
    socket.on('end_game', (param) => handle_end_game(param, io, admin));
    socket.on('private_data_request', (param) => handle_private_data_request(param, socket, admin));
    socket.on('player_action', (param) => handle_player_action(param, io, admin));
});

server.listen(port, () => { console.log(`> Ready on http://localhost:${port}`) });
