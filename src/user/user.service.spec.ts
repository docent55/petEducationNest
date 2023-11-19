import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUserDto";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
  });

  it("UserService should be defined", () => {
    expect(service).toBeDefined();
  });

  it("userRepository should be defined", () => {
    expect(userRepository).toBeDefined();
  });

  describe("create User", () => {
    const testUserDto: CreateUserDto = {
      email: "re@ma.ru",
      password: "123456",
      username: "user",
    };

    it("should findOne by email", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce({ email: testUserDto.email, bio: "", id: 1, image: "", password: "123", username: "testUser" });

      try {
        await service.createUser(testUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect((error as HttpException).getResponse()).toMatchObject({ errors: { email: "has already been taken!" } });
      }
    });

    it("should findOne by username", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce({ email: testUserDto.email, bio: "", id: 1, image: "", password: "123", username: "testUser" });
      try {
        await service.createUser(testUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect((error as HttpException).getResponse()).toMatchObject({ errors: { username: "has already been taken!" } });
      }
    });

    it("should create User", async () => {
      await service.createUser(testUserDto);
      expect(userRepository.save).toBeCalledWith(testUserDto);
    });
  });
});
