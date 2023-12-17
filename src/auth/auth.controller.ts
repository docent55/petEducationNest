import { Body, Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RefreshTokenDto } from "./dto/refreshToken.dto";
import { CreateUserDto } from "src/user/dto/createUserDto";
import { LoginUserDto } from "./dto/loginUserDto.dto";
// import { ValidationPipe } from "validation.pipe"; // Подумать над универсальным пайпом

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  //   @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post("refresh")
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refreshToken({ refreshToken });
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
