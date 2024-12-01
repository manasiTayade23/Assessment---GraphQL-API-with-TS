import { Resolver, Mutation, Arg } from "type-graphql";
import { AuthService } from "./auth.service";

@Resolver()
export class AuthResolver {
  @Mutation(() => String)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    return AuthService.register(username, email, password);
  }

  @Mutation(() => String)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    return AuthService.login(email, password);
  }
}
