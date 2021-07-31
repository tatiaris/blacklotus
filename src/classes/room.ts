import { Player } from "./player";

export class Room {
  uid: string;
  players: Map<string, Player>;

  constructor(uid: string, initialPlayer: Player) {
    this.uid = uid;
    this.players = new Map<string, Player>();
    this.players.set(initialPlayer.getUsername(), initialPlayer);
  }

  getUid = () => this.uid
  setUid = (newUid: string) => { this.uid = newUid }

  getPlayer = (id: string): Player => this.players.get(id) || new Player(id, this.players.get(id)?.getUid() || "temp_uid")
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
  addPlayer = (newPlayer: Player) => { this.players.set(newPlayer.getUsername(), newPlayer) }
  removePlayer = (playerId: string) => { this.players.delete(playerId) }

  isEmpty = () => this.players.size === 0
  getTotalPlayers = () => this.players.size;

  toString = () => {
    let playersToString = "";
    this.players.forEach((p) => { playersToString += p.toString() })

    return `\nROOM ${this.uid}\nGame: development\nPlayers:\n${playersToString}\n`;
  }
}