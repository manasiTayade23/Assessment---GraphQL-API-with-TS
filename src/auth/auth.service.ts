import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../database/models/user.model";

export class AuthService {
  static async register(username: string, email: string, password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    return jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });
  }
}
