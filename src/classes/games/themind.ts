import { Player } from "../player";
import { Room } from "../room";

const getMindLevels = (p: number) => {
  if (p == 2) return 12;
  if (p == 3) return 10;
  return 8;
}

export class TheMindRoom extends Room {
  level: number;
  totalLevels: 8 | 10 | 12;
  totalCards: number;
  cardsRemaining: number;
  livesRemaining: number;
  cardsPlayedList: Array<number>;

  constructor(uid: string, gameType: string, initialPlayer?: Player) {
    super(uid, gameType, initialPlayer);
    this.maxPlayers = 4;
    this.level = 0;
    this.totalLevels = 12;
    this.totalCards = 0;
    this.cardsRemaining = 0;
    this.livesRemaining = 0;
    this.cardsPlayedList = [];
  };

  startGame() {
    super.startGame();
    this.setup();
  }

  setup() {
    this.level = 1;
    this.totalLevels = getMindLevels(this.getTotalPlayers());
    this.totalCards = this.getTotalPlayers() * this.level;
    this.cardsRemaining = this.totalCards;
    this.livesRemaining = this.getTotalPlayers();
    this.cardsPlayedList = [];
  }
}