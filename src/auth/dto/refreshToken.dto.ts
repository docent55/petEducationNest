import { IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString({ message: "Need pass refresh-token" })
  refreshToken?: string;
}
