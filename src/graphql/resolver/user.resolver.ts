import { Resolver, Query, Mutation, Arg } from "type-graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/user.model";

// Ensure to load environment variables
import dotenv from "dotenv";
dotenv.config(); // This will load the .env file into process.env

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.findAll(); // Fetch users from the database
  }

  @Mutation(() => String)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    // Use the admin secret from environment variables
    const adminSecret = process.env.ADMIN_SECRET || "default-secret"; // Fallback to default if not set
    return jwt.sign({ id: user.id }, adminSecret);
  }

  @Mutation(() => String)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    // Use the admin secret from environment variables
    const adminSecret = process.env.ADMIN_SECRET || "default-secret"; // Fallback to default if not set
    return jwt.sign({ id: user.id }, adminSecret);
  }
}
