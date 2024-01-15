import { Controller, Get, Header } from "@nestjs/common";
import { TestService } from "./test.service";

@Controller("test")
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  @Header("Content-Type", "application/json")
  @Header("Content-Disposition", 'attachment; filename="package.json"')
  async getFile() {
    return this.testService.getStaticFile();
  }
}
