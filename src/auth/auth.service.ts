import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { Tokens } from "./types/tokens.type";
import { JwtPayload } from "./types/jwtPayload.type";
import { CreateUserDto } from "src/user/dto/createUserDto";
import { LoginUserDto } from "./dto/loginUserDto.dto";
import * as bcrypt from "bcrypt";

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

  async login(loginUserDto: LoginUserDto) {
    const errorResponse = {
      errors: { "email or password": "is invalid" },
    };

    const user = await this.userService.findOneWithEmail(loginUserDto.email);

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const tokens = await this.generateTokens(user.email, user.id);

    delete user.password;

    return {
      ...user,
      ...tokens,
    };
  }
}
