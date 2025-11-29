// types/express/index.d.ts
import { modelAuthorsType } from "../../src/Types/author.type"; 

declare global {
  namespace Express {
    interface Request {
      user?: modelAuthorsType;
    }
  }
}
