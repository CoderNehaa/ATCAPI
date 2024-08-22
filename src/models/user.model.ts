import pool from "../config/db.connect";

export enum Provider {
  password="password",
  google="google",
  facebook="facebook",
}

enum SubscriptionType {
  free="free",
  paid="paid",
}

export interface UserInterface {
  id?: number; //unique(primary key)
  username: string; //not null/required
  password?: string; //nullable for social logins
  email: string; //unique
  bio?: string;
  subscriptionType?: SubscriptionType; //handled enum in db, by default free
  totalArticles?: number; //handled in db, 0
  accountDate?: Date; //handled in db, by default date.now()
  profilePicture?: string;
  socialId?: string; //nullable for password login
  provider: Provider; //required enum, no default value
  isVerified: boolean; //true for social logins
}

export class UserModel {
  static async getAll():Promise<any>{
    const [users] = await pool.query(`SELECT * FROM users`);
    return users;
  }

  static async getByEmail(email: string): Promise<any> {
    const [data]: Array<any> = await pool.query(
      "SELECT * FROM users where email = ?",
      [email]
    );
    if (data.length > 0) {
      return {
        result: true,
        user: data[0],
      };
    } else {
      return {
        result: false,
        message: "No account found with this email",
      };
    }
  }

  static async getbyId(id: number): Promise<any> {
    if(!id){
      return;
    }
    const [data]: Array<any> = await pool.query(
      "SELECT * FROM users where id = ?",
      [id]
    );
    
    if (data.length > 0) {
      return {
        result: true,
        user: data[0],
      };
    } else {
      return {
        result: false,
        message: "No account found with this credentials",
      };
    }
  }

  static async create(user: UserInterface): Promise<UserInterface> {
    const result:any = await pool.query(
      `INSERT INTO 
      users (email, provider, socialId, username, bio, profilePicture, isVerified, password) 
      VALUE(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.email,
        user.provider,
        user.socialId,
        user.username,
        user.bio,
        user.profilePicture,
        user.isVerified,
        user.password,
      ]
    );
    
    const newUserId = result[0].insertId;
    const newUser = await this.getbyId(newUserId);
    return newUser.user;
  }

  static async delete(userId: number): Promise<void> {
    debugger;
    await pool.query(`DELETE FROM users where id = ${userId}`);
  }

  static async update(user:UserInterface){
    const query = `
      UPDATE users SET bio = ? , profilePicture = ?, username = ? WHERE id = ?`
    const result = await pool.query(query, [user.bio, user.profilePicture, user.username, user.id])
  }
}
