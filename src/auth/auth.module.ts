import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { jwtConstants } from "./constanst";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
