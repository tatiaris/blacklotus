import { theMindPrivateData } from "src/interfaces";

export function generatePicString() {
  let s = "";
  for (let i = 0; i < 50; i++) {
    s += Math.round(Math.random());
  }
  return s;
}

export class Player {
  username: string;
  uid: string;
  admin: boolean;
  stats: object;
  picString: string;
  privateGameData: theMindPrivateData | {};

  constructor(username: string, uid: string, admin: boolean=false) {
    this.username = username;
    this.uid = uid;
    this.admin = admin;
    this.stats = {};
    this.picString = generatePicString();
    this.privateGameData = {};
  }

  getUid() { return this.uid }
  setUid(newUid: string) { this.uid = newUid }

  getUsername() { return this.username }
  setUsername(newUsername: string) { this.username = newUsername }

  getPicString() { return this.picString }
  resetPicString() { this.picString = generatePicString() }

  isAdmin() { return this.admin }
  makeAdmin() { this.admin = true; }

  getPrivateGameData() { return this.privateGameData }
  setPrivateGameData(updatedPrivateGameData: any) { this.privateGameData = updatedPrivateGameData }

  getInfo() {
    return {
      username: this.username,
      picString: this.picString,
      admin: this.admin
    }
  }

  toString() {
    return `\nName: ${this.username}\nUID: ${this.uid}\n`;
  }
}