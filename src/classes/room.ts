import { roomJsonObj } from "src/interfaces";
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
  lastActive: Date;
  maxPlayers: number;

  constructor(uid: string, gameType: string, initialPlayer?: Player) {
    this.#uid = uid;
    this.gameType = gameType;
    this.players = new Map<string, Player>();
    this.spectators = new Map<string, Player>();
    this.gameInProgress = false;
    this.lastActive = new Date();
    this.maxPlayers = 24;
    if (initialPlayer) this.players.set(initialPlayer.getUsername(), initialPlayer);
  }

  getUid() { return this.#uid }
  setUid(newUid: string) { this.#uid = newUid }

  getGameType() { return this.gameType }
  isGameInProgress() { return this.gameInProgress }
  startGame() { this.gameInProgress = true }
  endGame() { this.gameInProgress = false }

  getPlayer(id: string): Player { return this.players.get(id) || new Player(id, this.players.get(id)?.getUid() || "error_id") }
  updatePlayerUsername(playerId: string, newPlayerId: string): string {
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

  getPlayers() { return this.players }
  addPlayer(newPlayer: Player) {
    if (this.isEmpty()) newPlayer.makeAdmin();
    if (this.gameInProgress || this.players.size >= this.maxPlayers) this.spectators.set(newPlayer.getUsername(), newPlayer);
    else this.players.set(newPlayer.getUsername(), newPlayer);
    this.updateLastActive();
  }
  removePlayer(playerId: string) {
    if (this.players.get(playerId)?.isAdmin()) {
      this.players.delete(playerId);
      this.players.get(getRandomKey(this.players))?.makeAdmin();
    }
    else {
      this.players.delete(playerId);
    }
    this.updateLastActive();
  }

  getSpectators() { return this.spectators }

  isEmpty() { return this.players.size === 0 }
  getTotalPlayers() { return this.players.size }

  updateLastActive() { this.lastActive = new Date() }

  getPublicData() { return {} }

  toJson() {
    let roomJson = <roomJsonObj>{};
    roomJson.gameType = this.gameType;
    roomJson.totalPlayers = this.getTotalPlayers();
    roomJson.players = {};
    this.getPlayers().forEach(player => {
      roomJson.players[player.getUsername()] = {
        username: player.getUsername(),
        picString: player.getPicString(),
        admin: player.isAdmin()
      }
    })
    roomJson.spectators = {};
    this.getSpectators().forEach(player => {
      roomJson.players[player.getUsername()] = {
        username: player.getUsername(),
        picString: player.getPicString(),
        admin: player.isAdmin()
      }
    })
    roomJson.inProgress = this.isGameInProgress();
    return roomJson;
  }

  toString() {
    let playersToString = "";
    this.players.forEach((p) => { playersToString += p.toString() })
    return `\nROOM ${this.#uid}\nGame: development\nPlayers:\n${playersToString}\n`;
  }
}