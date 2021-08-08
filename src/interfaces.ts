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
export interface removePlayerParams {
  room_id: string;
  username: string;
}
export interface PlayerObj {
  username: string;
  picString: string;
  admin: boolean;
}
export interface roomJsonObj {
  gameType: string;
  totalPlayers: number;
  players: Record<string, PlayerObj>;
  spectators: Record<string, PlayerObj>;
  inProgress: boolean;
}

// The Mind interfaces

export interface theMindPrivateData {
  cards: Array<number>;
}
export interface theMindPublicData {
  level: number;
  totalPlayers: number;
  totalLevels: 8 | 10 | 12;
  totalCards: number;
  cardsRemaining: number;
  livesRemaining: number;
  cardsPlayedList: Array<number>;
}