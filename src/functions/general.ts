import * as socketio from 'socket.io';
import { Admin } from 'src/classes/admin';
import { roomParams, identifierParams, messageParams, updateUsernameParams, playerActionObj } from 'src/interfaces';

const generateRoomId = (admin: Admin) => {
  let id = 1000 + Math.round(Math.random()*100);
  while (admin.roomMap.has(id.toString())) id += Math.round(Math.random()*10 + 1);
  return id.toString();
}

const getUniqueUsername = (admin: Admin, room_id: string) => {
  let username = "player";
  let i = 0;
  while (admin.getRoom(room_id)?.players.has(username + i)) i++;
  return username + i;
}

export const handle_create_room = (param: string, socket: socketio.Socket, admin: Admin) => {
  console.log(`creating new ${param} game room`);
  const room_id = generateRoomId(admin);
  admin.createNewRoom(room_id, param);
  socket.emit('room_created', room_id);
}

export const handle_join_room = (param: roomParams, io: socketio.Server, socket: socketio.Socket, admin: Admin) => {
  const { room_id } = param;
  if (admin.roomMap.has(room_id)) {
    const username = getUniqueUsername(admin, room_id);
    admin.addUserToRoom(room_id, username, socket.id);
    console.log(`user ${username} added to room ${room_id}`);
    socket.join(room_id);
    socket.emit("joined_room", { userInfo: admin.getRoom(room_id)?.getPlayer(username).getInfo(), gameType: admin.getRoomGameType(room_id) });
    io.in(room_id).emit('room_update', admin.getRoom(room_id)?.toJson());
    io.in(room_id).emit('notification', { content: `${username} has joined the room!`, type: 'success' });
    admin.printRoomMap();
  } else {
    socket.emit('room_not_found')
  }
}

export const handle_message = (param: messageParams, io: socketio.Server) => {
  const { room_id, username, content } = param;
  io.in(room_id).emit('new_message', { username, content });
}

export const handle_update_username = (param: updateUsernameParams, io: socketio.Server, socket: socketio.Socket, admin: Admin) => {
  const { room_id, username, newUsername } = param;
  const newUsernameAdjusted = admin.updatePlayerUsername(room_id, username, newUsername, socket.id);
  socket.emit('username_updated', newUsernameAdjusted);
  io.in(room_id).emit('room_update', admin.getRoom(room_id)?.toJson());
  io.in(room_id).emit('new_message', { username: "server", content: `${username} updated their name to ${newUsernameAdjusted}` });
  admin.printRoomMap();
}

export const handle_kick_user = (param: updateUsernameParams, io: socketio.Server, socket: socketio.Socket, admin: Admin) => {
  const { room_id, username } = param;
  io.to(admin.getSocketId(room_id, username)).emit('you_are_kicked');
  io.in(room_id).emit('notification', { content: `${username} has been kicked.`, type: 'danger' });
  socket.emit('user_kicked', username);
}

export const handle_disconnect = (io: socketio.Server, socket: socketio.Socket, admin: Admin) => {
  const playerUid = socket.id;
  if (admin.userUidMap.get(playerUid)) {
      const room_id = admin.userUidMap.get(playerUid)?.room_id || "";
      const username = admin.userUidMap.get(playerUid)?.username || "";
      admin.removeUserFromRoom(room_id, username, playerUid);
      console.log(`removed ${username} from room ${room_id}`);
      admin.printRoomMap();
      io.in(room_id).emit('room_update', admin.getRoom(room_id)?.toJson());
      io.in(room_id).emit('notification', { content: `${username} has disconnected.`, type: 'danger' });
  }
}

export const handle_start_game = (param: updateUsernameParams, io: socketio.Server, admin: Admin) => {
  const { room_id } = param;
  admin.getRoom(room_id)?.startGame();
  if (admin.getRoom(room_id)?.gameInProgress) {
    io.in(room_id).emit('public_data_update', admin.getRoom(room_id)?.getPublicData());
    io.in(room_id).emit('room_update', admin.getRoom(room_id)?.toJson());
    io.in(room_id).emit('notification', { content: "The game has started!", type: 'success' });
  }
  else {
    io.in(room_id).emit('new_message', { username: "server", content: "Could not start game. Please make sure you have enough players in the room." });
  }
}

export const handle_end_game = (param: roomParams, io: socketio.Server, admin: Admin) => {
  const { room_id } = param;
  admin.getRoom(room_id)?.endGame();
  io.in(room_id).emit('game_has_ended');
  io.in(room_id).emit('room_update', admin.getRoom(room_id)?.toJson());
  io.in(room_id).emit('notification', { content: "The game has ended.", type: 'danger' });
}

export const handle_private_data_request = (param: identifierParams, socket: socketio.Socket, admin: Admin) => {
  const { room_id, username } = param;
  socket.emit('private_data_update', admin.getRoom(room_id)?.getPlayer(username).getPrivateGameData());
}

export const handle_player_action = (param: playerActionObj, io: socketio.Server, admin: Admin) => {
  const { room_id, username, actionType, actionData } = param;
  admin.getRoom(room_id)?.handlePlayerAction(username, actionType, actionData);
  io.in(room_id).emit('public_data_update', admin.getRoom(room_id)?.getPublicData());
}