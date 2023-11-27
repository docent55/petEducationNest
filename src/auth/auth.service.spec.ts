import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/createUserDto";
import { Tokens } from "./types/tokens.type";

describe("AuthService", () => {
  let service: AuthService;

  const testData = {
    email: "mail@test.ru",
    id: 1,
  };

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return tokens", async () => {
    jest.spyOn(JwtService.prototype, "signAsync").mockResolvedValueOnce("q1w2e3r4");
    jest.spyOn(JwtService.prototype, "signAsync").mockResolvedValueOnce("1qa2ws3e");
    const tokens = await service.generateTokens(testData.email, testData.id);
    expect(tokens).toMatchObject({ accessToken: "q1w2e3r4", refreshToken: "1qa2ws3e" });
  });

  it("should be registered user", async () => {
    const createUserTestPayload: CreateUserDto = {
      email: "test@mail.ru",
      password: "11111111",
      username: "User",
    };

    const testCreatedUser: UserEntity = {
      email: "test@mail.ru",
      bio: "",
      id: 1,
      image: "",
      password: "123",
      username: "testUser",
    };
    const testPareTokens: Tokens = {
      accessToken: "q1w2e3r4",
      refreshToken: "1qa2ws3e",
    };

    jest.spyOn(UserService.prototype, "createUser").mockResolvedValueOnce(testCreatedUser);
    jest.spyOn(service, "generateTokens").mockResolvedValue(testPareTokens);

    const user = await service.register(createUserTestPayload);
    expect(user).toMatchObject({ ...testCreatedUser, ...testPareTokens });
  });
});
