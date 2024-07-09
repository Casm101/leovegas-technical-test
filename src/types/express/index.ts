import { Request } from "express";
import { JwtDecyptedUserToken } from "../jwt";

export interface ExtendedRequest extends Request {
  user?: JwtDecyptedUserToken;
}