export class Player {
  username: string;
  uid: string;
  admin: boolean;
  stats: object;

  constructor(username: string, uid: string, admin: boolean=false) {
    this.username = username;
    this.uid = uid;
    this.admin = admin;
    this.stats = {};
  }

  getUid() { return this.uid }
  setUid(newUid: string) { this.uid = newUid }

  getUsername() { return this.username }
  setUsername(newUsername: string) { this.username = newUsername }

  isAdmin() { return this.admin }
  makeAdmin() { this.admin = true; }

  toString() {
    return `\nName: ${this.username}\nUID: ${this.uid}\n`;
  }
}