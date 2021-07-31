import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import { Player } from './classes/player';
import { Room } from './classes/room';

const port: number = parseInt(process.env.PORT || '8888', 10);

interface connectionParams {
    room_id: string;
}
interface messageParams {
    room_id: string;
    username: string;
    content: string;
}
interface updateUsernameParams {
    room_id: string;
    username: string;
    newUsername: string;
}
interface playerInfoParams {
    room_id: string;
    username: string;
}
interface PlayerObj {
    username: string;
    admin: boolean;
}
interface roomJsonObj {
    totalPlayers: number;
    players: Array<PlayerObj>;
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

const roomToJson = (room: Room | undefined) => {
    let roomJson = <roomJsonObj>{};
    if (room){
        roomJson.totalPlayers = room.getTotalPlayers();
        roomJson.players = [];
        room.getPlayers().forEach(player => {
            roomJson.players.push({
                username: player.getUsername(),
                admin: player.isAdmin()
            })
        })
    }
    return roomJson;
}

const app: Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, {
    cors: {
        origin: ["https://boardgames-rho.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
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
            roomMap.set(room_id, new Room(room_id, new Player(username, socket.id, true)))
        }
        console.log(`user ${username} joined room ${room_id}`);
        playerUidMap.set(socket.id, { room_id, username });
        socket.join(room_id);
        socket.emit("joined_room", username);
        io.in(room_id).emit('room_update', roomToJson(roomMap.get(room_id)));
        printRoomMap();
    })

    socket.on('message', (messageObj: messageParams) => {
        const { room_id, username, content } = messageObj;
        io.in(room_id).emit('new_message', { username, content });
        console.log(`new_message from ${username} in room ${room_id}: ${content}`);
    })

    socket.on('update_username', (updateUsernameObj: updateUsernameParams) => {
        const { room_id, username, newUsername } = updateUsernameObj;
        const newUsernameAdjusted = roomMap.get(room_id)?.updatePlayerUsername(username, newUsername);
        playerUidMap.set(socket.id, { username: newUsernameAdjusted || "error", room_id: room_id });
        socket.emit('username_updated', newUsernameAdjusted);
        io.in(room_id).emit('room_update', roomToJson(roomMap.get(room_id)));
        printRoomMap();
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
            io.in(roomId).emit('room_update', roomToJson(roomMap.get(roomId)));
        }
    })
});

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});
