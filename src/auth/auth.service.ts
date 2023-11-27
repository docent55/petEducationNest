import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { Tokens } from "./types/tokens.type";
import { JwtPayload } from "./types/jwtPayload.type";
import { CreateUserDto } from "src/user/dto/createUserDto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(email: string, id: number): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      email: email,
      sub: id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: "1m",
      }),

      this.jwtService.signAsync(jwtPayload, {
        expiresIn: "1d",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);

    const tokens = await this.generateTokens(newUser.email, newUser.id);

    delete newUser.password;

    return {
      ...newUser,
      ...tokens,
    };
  }
}
