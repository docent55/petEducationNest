import { Injectable, StreamableFile, Logger } from "@nestjs/common";
import { createReadStream } from "fs";
import { join } from "path";

@Injectable()
export class TestService {
  getStaticFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), "package.json"));
    if (file) Logger.log("Get your file");
    return new StreamableFile(file);
  }
}
