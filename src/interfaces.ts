export interface connectionParams {
  room_id: string;
}
export interface messageParams {
  room_id: string;
  username: string;
  content: string;
}
export interface updateUsernameParams {
  room_id: string;
  username: string;
  newUsername: string;
}
export interface PlayerObj {
  username: string;
  admin: boolean;
}
export interface roomJsonObj {
  gameType: string;
  totalPlayers: number;
  players: Array<PlayerObj>;
}
