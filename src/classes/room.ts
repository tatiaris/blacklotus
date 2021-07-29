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

  getPlayers = () => this.players
  addPlayer = (newPlayer: Player) => { this.players.set(newPlayer.getUsername(), newPlayer) }
  removePlayer = (playerId: string) => { this.players.delete(playerId) }

  isEmpty = () => this.players.size === 0

  toString = () => {
    let playersToString = "";
    this.players.forEach((p) => { playersToString += p.toString() })

    return `\nROOM ${this.uid}\nGame: development\nPlayers:\n${playersToString}\n`;
  }
}