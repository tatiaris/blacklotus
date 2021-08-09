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
    if (this.players.size >= this.minPlayers) {
      super.startGame();
      this.setup();
    }
  }

  setup() {
    // set up public info
    this.level = 5;
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

  handlePlayerAction(username: string, actionType: string, actionData: any) {
    switch (actionType) {
      case "play_lowest_card":
        this.handlePlayLowestCard(username)
        break;
      default:
        console.log(username, actionType, actionData);
        break;
    }
  }

  handlePlayLowestCard(username: string) {
    let playerCards: Array<number> = this.getPlayer(username).getPrivateGameDataValue('cards');
    if (playerCards.length > 0) {
      let lifeLost = false;
      const cardPlayed = playerCards.shift() || -1;
      this.cardsPlayedList.push(cardPlayed);
      this.cardsRemaining--;
      this.players.forEach(p => {
        let otherPlayerCards: Array<number> = p.getPrivateGameDataValue('cards');
        if (cardPlayed > otherPlayerCards[0]) lifeLost = true;
        while (otherPlayerCards.length > 0 && cardPlayed > otherPlayerCards[0]) {
          this.cardsPlayedList.push(otherPlayerCards.shift() || -1);
          this.cardsRemaining--;
        }
        p.setPrivateGameDataValue('cards', otherPlayerCards);
      })
      if (lifeLost) this.livesRemaining--;
      this.getPlayer(username).setPrivateGameDataValue('cards', playerCards);
    }
  }
}