import { Player } from "../player";
import { getRandomKey, Room } from "../room";

export class TheMindRoom extends Room {
  currentPlayer: string | undefined;

  constructor(uid: string, gameType: string, initialPlayer?: Player) {
    super(uid, gameType, initialPlayer);
    this.currentPlayer = initialPlayer?.getUsername();
    this.publicGameData = {}
  };

  addPlayer(newPlayer: Player) {
    super.addPlayer(newPlayer);
    this.currentPlayer = getRandomKey(this.players);
  };

  startGame() {
    super.startGame();
  }
}