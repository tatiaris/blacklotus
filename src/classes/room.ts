import { roomJsonObj } from "src/interfaces";
import { Player } from "./player";

export class Room {
  #uid: string;
  currentAdmin: string;
  players: Map<string, Player>;
  spectators: Map<string, Player>;
  gameType: string;
  gameInProgress: boolean;
  lastActive: Date;
  maxPlayers: number;
  minPlayers: number;

  constructor(uid: string, gameType: string, initialPlayer?: Player) {
    this.#uid = uid;
    this.currentAdmin = '';
    this.gameType = gameType;
    this.players = new Map<string, Player>();
    this.spectators = new Map<string, Player>();
    this.gameInProgress = false;
    this.lastActive = new Date();
    this.maxPlayers = 24;
    this.minPlayers = 2;
    if (initialPlayer) this.players.set(initialPlayer.getUsername(), initialPlayer);
  }

  getUid() { return this.#uid }
  setUid(newUid: string) { this.#uid = newUid }

  getGameType() { return this.gameType }
  isGameInProgress() { return this.gameInProgress }
  startGame() { this.gameInProgress = true }
  endGame() {
    this.gameInProgress = false
    this.players.forEach(p => { p.setPrivateGameData({}) })
  }

  getPlayer(id: string): Player { return this.players.get(id) || new Player(id, this.players.get(id)?.getUid() || "error_id") }
  updatePlayerUsername(userId: string, newUserId: string): string {
    if (this.players.has(newUserId)) {
      let i = 1;
      while (this.players.has(newUserId + i)) i++;
      newUserId += i;
    }
    this.players.get(userId)?.setUsername(newUserId);
    this.players.set(newUserId, this.getPlayer(userId));
    if (this.players.get(userId)?.getUsername() == this.currentAdmin) this.currentAdmin = newUserId;
    this.players.delete(userId);
    return newUserId;
  }

  getUsernameFromUID(uid: string) {
    Object.keys(this.players).map(p => {
      if (this.players.get(p)?.getUid() === uid) return p;
    })
    return "error_username";
  }

  assignRandomAdmin() {
    if (this.players.size > 0) {
      this.currentAdmin = Array.from(this.players.keys())[0];
    }
    else if (this.spectators.size > 0) {
      this.currentAdmin = Array.from(this.spectators.keys())[0];
    }
  }

  getPlayers() { return this.players }
  addUser(newPlayer: Player) {
    if (this.isEmpty()){
      this.currentAdmin = newPlayer.getUsername();
    }
    if (this.gameInProgress || this.players.size >= this.maxPlayers) this.spectators.set(newPlayer.getUsername(), newPlayer);
    else this.players.set(newPlayer.getUsername(), newPlayer);
    this.updateLastActive();
  }
  removePlayer(userId: string) {
    if (this.players.get(userId)?.getUsername() == this.currentAdmin) {
      this.players.delete(userId);
      this.assignRandomAdmin();
    } else {
      this.players.delete(userId);
    }
  }

  getSpectators() { return this.spectators }
  removeSpectator(userId: string) {
    if (this.players.get(userId)?.getUsername() == this.currentAdmin) {
      this.spectators.delete(userId);
      this.assignRandomAdmin();
    } else {
      this.spectators.delete(userId);
    }
  }

  removeUser(userId: string) {
    if (this.players.has(userId)) this.removePlayer(userId);
    if (this.spectators.has(userId)) this.removeSpectator(userId);
    this.updateLastActive();
  }

  isEmpty() { return this.players.size === 0 }
  getTotalPlayers() { return this.players.size }

  updateLastActive() { this.lastActive = new Date() }

  getPublicData() { return {} }

  toJson() {
    let roomJson = <roomJsonObj>{};
    roomJson.gameType = this.gameType;
    roomJson.totalPlayers = this.getTotalPlayers();
    roomJson.currentAdmin = this.currentAdmin;
    roomJson.players = {};
    this.getPlayers().forEach(player => {
      roomJson.players[player.getUsername()] = {
        username: player.getUsername(),
        picString: player.getPicString()
      }
    })
    roomJson.spectators = {};
    this.getSpectators().forEach(player => {
      roomJson.spectators[player.getUsername()] = {
        username: player.getUsername(),
        picString: player.getPicString()
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

  handlePlayerAction(username: string, actionType: string, actionData: any) {
    console.log(username, actionType, actionData);
  }
}