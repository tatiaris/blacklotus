export class Player {
  username: string;
  uid: string;

  constructor(username: string, uid: string) {
    this.username = username
    this.uid = uid
  }

  getUid = () => this.uid
  setUid = (newUid: string) => { this.uid = newUid }

  getUsername = () => this.username
  setUsername = (newUsername: string) => { this.username = newUsername }

  toString = () => {
    return `\nName: ${this.username}\nUID: ${this.uid}\n`;
  }
}