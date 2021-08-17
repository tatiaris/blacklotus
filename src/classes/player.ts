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
  stats: object;
  picString: string;
  privateGameData: any;

  constructor(username: string, uid: string) {
    this.username = username;
    this.uid = uid;
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

  getPrivateGameData() { return this.privateGameData }
  setPrivateGameData(updatedPrivateGameData: any) { this.privateGameData = updatedPrivateGameData }
  getPrivateGameDataValue(key: string) { return this.privateGameData[key] }
  setPrivateGameDataValue(key: string, value: any) { this.privateGameData[key] = value }

  getInfo() {
    return {
      username: this.username,
      picString: this.picString
    }
  }

  toString() {
    return `\nName: ${this.username}\nUID: ${this.uid}\n`;
  }
}