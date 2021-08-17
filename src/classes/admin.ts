import { BombsquadRoom } from "./games/bombsquad";
import { TheMindRoom } from "./games/themind";
import { Player } from "./player";
import { Room } from "./room";

interface userInfoParams {
  room_id: string;
  username: string;
}

export class Admin {
  userUidMap: Map<string, userInfoParams>;
  roomMap: Map<string, Room>;

  constructor() {
    this.userUidMap = new Map<string, userInfoParams>();
    this.roomMap = new Map<string, Room>();
  }

  getSocketId(room_id: string, username: string): string {
    return this.roomMap.get(room_id)?.getPlayer(username).getUid() || "error_uid";
  }

  getRoom(room_id: string) {
    return this.roomMap.get(room_id);
  }

  getRoomGameType(room_id: string) {
    return this.roomMap.get(room_id)?.getGameType();
  }

  createNewRoom(room_id: string, gameType: string) {
    switch (gameType) {
      case "bomb-squad":
        this.roomMap.set(room_id, new BombsquadRoom(room_id, gameType));
        break;
      case "the-mind":
        this.roomMap.set(room_id, new TheMindRoom(room_id, gameType));
        break;
      default:
        this.roomMap.set(room_id, new Room(room_id, gameType));
        break;
    }
  }

  addUserToRoom(room_id: string, username: string, uid: string) {
    this.roomMap.get(room_id)?.addUser(new Player(username, uid));
    this.userUidMap.set(uid, { room_id, username });
  }

  removeUserFromRoom(room_id: string, username: string, uid: string) {
    this.roomMap.get(room_id)?.removeUser(username);
    if (this.roomMap.get(room_id)?.isEmpty()) {
        this.roomMap.delete(room_id)
    }
    this.userUidMap.delete(uid)
  }

  updatePlayerUsername(room_id: string, username: string, newUsername: string, uid: string) {
    const newUsernameAdjusted = this.roomMap.get(room_id)?.updatePlayerUsername(username, newUsername);
    this.userUidMap.set(uid, { username: newUsernameAdjusted || "error", room_id });
    return newUsernameAdjusted;
  }

  printRoomMap() {
    console.log("************ Rooms Status START ************")
    this.roomMap.forEach(room => console.log(room.toString()));
    console.log("************  Rooms Status END  ************")
  }

  toString() {
    return `Admin`;
  }
}