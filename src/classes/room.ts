import { Player } from "./player";

export function getRandomKey(collection: Map<string, Player>) {
  let keys = Array.from(collection.keys());
  return keys[Math.floor(Math.random() * keys.length)];
}

export class Room {
  #uid: string;
  players: Map<string, Player>;
  spectators: Map<string, Player>;
  gameType: string;
  gameInProgress: boolean;

  constructor(uid: string, gameType: string, initialPlayer?: Player) {
    this.#uid = uid;
    this.gameType = gameType;
    this.players = new Map<string, Player>();
    this.spectators = new Map<string, Player>();
    this.gameInProgress = false;
    if (initialPlayer) this.players.set(initialPlayer.getUsername(), initialPlayer);
  }

  getUid = () => this.#uid
  setUid = (newUid: string) => { this.#uid = newUid }

  getGameType = () => this.gameType
  isGameInProgress = () => this.gameInProgress

  getPlayer = (id: string): Player => this.players.get(id) || new Player(id, this.players.get(id)?.getUid() || "error_id")
  updatePlayerUsername = (playerId: string, newPlayerId: string): string => {
    if (this.players.has(newPlayerId)) {
      let i = 1;
      while (this.players.has(newPlayerId + i)) i++;
      newPlayerId += i;
    }
    this.players.get(playerId)?.setUsername(newPlayerId);
    this.players.set(newPlayerId, this.getPlayer(playerId));
    this.players.delete(playerId);
    return newPlayerId;
  }

  getPlayers = () => this.players
  addPlayer (newPlayer: Player) {
    if (!this.gameInProgress) this.players.set(newPlayer.getUsername(), newPlayer);
    else this.spectators.set(newPlayer.getUsername(), newPlayer);
  }
  removePlayer (playerId: string) {
    if (this.players.get(playerId)?.isAdmin()) {
      this.players.delete(playerId);
      this.players.get(getRandomKey(this.players))?.makeAdmin();
    }
    else {
      this.players.delete(playerId);
    }
  }

  isEmpty = () => this.players.size === 0
  getTotalPlayers = () => this.players.size;

  toString = () => {
    let playersToString = "";
    this.players.forEach((p) => { playersToString += p.toString() })

    return `\nROOM ${this.#uid}\nGame: development\nPlayers:\n${playersToString}\n`;
  }
}