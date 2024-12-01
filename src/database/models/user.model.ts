import { ObjectType, Field } from "type-graphql";
import { Model, Column, DataType, Table } from "sequelize-typescript";

// Sequelize User model
@Table({ tableName: 'users' }) 
@ObjectType() 
export class User extends Model {
  @Field() 
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;  

  @Field() 
  @Column(DataType.STRING)
  username!: string;  

  @Field() 
  @Column(DataType.STRING)
  email!: string;  
  @Column(DataType.STRING) 
  password!: string;  
  constructor() {
    super();
  }
}
