import { Player } from "../player";
import { Room } from "../room";

export class BombsquadRoom extends Room {
  currentPlayer: string | undefined;

  constructor(uid: string, gameType: string, initialPlayer?: Player) {
    super(uid, gameType, initialPlayer);
    this.currentPlayer = initialPlayer?.getUsername();
  };

  addUser(newPlayer: Player) {
    super.addUser(newPlayer);
  };

  startGame() {
    super.startGame();
  }
}