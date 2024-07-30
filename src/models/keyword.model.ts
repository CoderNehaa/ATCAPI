import pool from "../config/db.connect"

export interface KeywordInterface{
  id?:number, //unique(primary key)
  name:string,  //not null/required
}

export class KeywordModel{
  static async keywordNameExists(keywordName:string):Promise<boolean>{
    const [keywords]:Array<any> = await pool.query(`SELECT * FROM keywords where keywordName = '${keywordName}'`);
    return keywords.length > 0;
  }

  static async getById(keywordId:number):Promise<any>{
    const [keywords]:Array<any> = await pool.query(`SELECT * FROM keywords where id = ${keywordId}`);
    return keywords.length > 0;
  }

  static async create(keywordName:string) :Promise<void> {
    await pool.query(`INSERT INTO keywords (keywordName) VALUE ('${keywordName}')`)    
  }

  static async delete(id:number) :Promise<void> {
    await pool.query(`DELETE FROM keywords WHERE id = ${id}`)    
  }

  static async getAll():Promise<[any]>{
    const [keywords]:Array<any> = await pool.query(`SELECT * FROM keywords`);
    return keywords;
  }
}


