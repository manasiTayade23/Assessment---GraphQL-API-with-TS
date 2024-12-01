import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user.model";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "postgres",
  database: "assessment-db",
  models: [User], 
});




export { sequelize, User };
