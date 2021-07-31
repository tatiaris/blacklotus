export class Player {
  username: string;
  uid: string;
  admin: boolean;

  constructor(username: string, uid: string, admin: boolean=false) {
    this.username = username;
    this.uid = uid;
    this.admin = admin;
  }

  getUid = () => this.uid
  setUid = (newUid: string) => { this.uid = newUid }

  getUsername = () => this.username
  setUsername = (newUsername: string) => { this.username = newUsername }

  isAdmin = () => this.admin;

  toString = () => {
    return `\nName: ${this.username}\nUID: ${this.uid}\n`;
  }
}