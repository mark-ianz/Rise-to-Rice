import { ReqUser } from "../account_info.types";

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser
    }
  }
}
