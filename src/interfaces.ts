export interface roomParams {
  room_id: string;
}
export interface identifierParams {
  room_id: string;
  username: string;
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
}
export interface roomJsonObj {
  gameType: string;
  totalPlayers: number;
  currentAdmin: string;
  players: Record<string, PlayerObj>;
  spectators: Record<string, PlayerObj>;
  inProgress: boolean;
}
export interface playerActionObj {
  room_id: string;
  username: string;
  actionType: string;
  actionData: any;
}

export interface gameRoom {
  handlePlayerAction: Function;
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