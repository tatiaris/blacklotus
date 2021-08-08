import { Player } from "../player";
import { Room } from "../room";

const getMindLevels = (p: number) => {
  if (p == 2) return 12;
  if (p == 3) return 10;
  return 8;
}

const getShuffledNValues = (n: number) => {
  let arr = [];
  while(arr.length < n){
    let r = Math.floor(Math.random() * 100) + 1;
    if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
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
    // set up public info
    this.level = 1;
    this.totalLevels = getMindLevels(this.getTotalPlayers());
    this.totalCards = this.getTotalPlayers() * this.level;
    this.cardsRemaining = this.totalCards;
    this.livesRemaining = this.getTotalPlayers();
    this.cardsPlayedList = [];

    // set up private info for each player
    let cards = getShuffledNValues(this.totalCards);
    this.players.forEach(p => {
      let privateCards = [];
      for (let i = 0; i < this.level; i++) {
        privateCards.push(cards[0]);
        cards.shift();
      }
      console.log(`cards for player ${p.getUsername()}: ${privateCards.toString()}`);
      p.setPrivateGameDataValue('cards', privateCards.sort())
    })
  }

  getPublicData() {
    return {
      level: this.level,
      totalLevels: this.totalLevels,
      totalCards: this.totalCards,
      cardsRemaining: this.cardsRemaining,
      livesRemaining: this.livesRemaining,
      cardsPlayedList: this.cardsPlayedList
    }
  }
}