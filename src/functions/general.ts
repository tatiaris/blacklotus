import * as socketio from 'socket.io';
import { Admin } from 'src/classes/admin';
import { Room } from 'src/classes/room';
import { connectionParams, messageParams, roomJsonObj, updateUsernameParams } from 'src/interfaces';

const generateRoomId = (admin: Admin) => {
  let id = 1000 + Math.round(Math.random()*100);
  while (admin.roomMap.has(id.toString())) id += Math.round(Math.random()*10 + 1);
  return id.toString();
}
const getUniqueUsername = (admin: Admin, room_id: string) => {
  let username = "player";
  let i = 0;
  while (admin.roomMap.get(room_id)?.players.has(username + i)) i++;
  return username + i;
}

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

export const handle_create_room = (param: string, socket: socketio.Socket, admin: Admin) => {
  console.log(`creating new ${param} game room`);
  const room_id = generateRoomId(admin);
  admin.createNewRoom(room_id)
  socket.emit('room_created', room_id);
}

export const handle_join_room = (param: connectionParams, io: socketio.Server, socket: socketio.Socket, admin: Admin) => {
  const { room_id } = param;
  if (admin.roomMap.has(room_id)) {
    const uniqueUsername = getUniqueUsername(admin, room_id);
    admin.addPlayerToRoom(room_id, uniqueUsername, socket.id)
    console.log(`user ${uniqueUsername} added to room ${room_id}`);
    socket.join(room_id);
    socket.emit("joined_room", uniqueUsername);
    io.in(room_id).emit('room_update', roomToJson(admin.roomMap.get(room_id)));
    admin.printRoomMap();
  }
}

export const handle_message = (param: messageParams, io: socketio.Server) => {
  const { room_id, username, content } = param;
  io.in(room_id).emit('new_message', { username, content });
  console.log(`new_message from ${username} in room ${room_id}: ${content}`);
}

export const handle_update_username = (param: updateUsernameParams, io: socketio.Server, socket: socketio.Socket, admin: Admin) => {
  const { room_id, username, newUsername } = param;
  const newUsernameAdjusted = admin.updatePlayerUsername(room_id, username, newUsername, socket.id);
  socket.emit('username_updated', newUsernameAdjusted);
  io.in(room_id).emit('room_update', roomToJson(admin.roomMap.get(room_id)));
  admin.printRoomMap();
}

export const handle_disconnect = (io: socketio.Server, socket: socketio.Socket, admin: Admin) => {
  const playerUid = socket.id;
  if (admin.playerUidMap.get(playerUid)) {
      const room_id = admin.playerUidMap.get(playerUid)?.room_id || "";
      const username = admin.playerUidMap.get(playerUid)?.username || "";
      admin.removePlaterFromRoom(room_id, username, playerUid);
      console.log(`removed ${username} from room ${room_id}`);
      admin.printRoomMap();
      io.in(room_id).emit('room_update', roomToJson(admin.roomMap.get(room_id)));
  }
}