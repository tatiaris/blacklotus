import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import { Player } from './player';
import { Room } from './room';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

interface connectionParams {
    room_id: string;
}
interface messageParams {
    room_id: string;
    username: string;
    content: string;
}
interface playerInfoParams {
    room_id: string;
    username: string;
}

let playerUidMap = new Map<string, playerInfoParams>();
let roomMap = new Map<string, Room>();

const printRoomMap = () => {
    console.log("************ Rooms Status START ************")
    roomMap.forEach(room => console.log(room.toString()));
    console.log("************  Rooms Status END  ************")
}

// const printUidInfoMap = () => {
//     console.log("************ Player Room Map START ************")
//     playerUidMap.forEach((info, uid) => console.log(`${uid} is in room ${info.room_id}`));
//     console.log("************  Player Room Map END  ************")
// }

nextApp.prepare().then(async() => {
    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io: socketio.Server = new socketio.Server();
    io.attach(server);

    app.get('/hello', async (_: Request, res: Response) => {
        res.send('Hello World')
    });

    io.on('connection', (socket: socketio.Socket) => {
        socket.on('join_room', (param: connectionParams) => {
            const { room_id } = param;
            let username = "player";
            if (roomMap.has(room_id)) {
                let i = 1;
                while (roomMap.get(room_id)?.players.has(username + i)) i++;
                username += i;
                roomMap.get(room_id)?.addPlayer(new Player(username, socket.id));
            }
            else {
                username = "player0";
                console.log(`creating new room ${room_id}`);
                roomMap.set(room_id, new Room(room_id, new Player(username, socket.id)))
            }
            console.log(`user ${username} joined room ${room_id}`);
            playerUidMap.set(socket.id, { room_id, username });
            socket.join(room_id);
            socket.emit("joined_room", username);
            printRoomMap();
        })

        socket.on('message', (messageObj: messageParams) => {
            const { room_id, username, content } = messageObj;
            socket.in(room_id).emit('new_message', content);
            console.log(`new_message from ${username} in room ${room_id}: ${content}`);
        })

        socket.on('disconnect', () => {
            const playerUid = socket.id;
            if (playerUidMap.get(playerUid)) {
                const roomId = playerUidMap.get(playerUid)?.room_id || "";
                const playerUsername = playerUidMap.get(playerUid)?.username || "";
                
                console.log(`removing ${playerUsername} from room ${roomId}`)

                roomMap.get(roomId)?.removePlayer(playerUsername);
                if (roomMap.get(roomId)?.isEmpty()) {
                    roomMap.delete(roomId)
                }
                playerUidMap.delete(playerUid)
                printRoomMap();
            }
        })
    });

    app.all('*', (req: any, res: any) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
