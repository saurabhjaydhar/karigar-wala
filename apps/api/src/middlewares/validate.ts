import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

type Target = "body" | "query" | "params";

export const validate =
  (schema: AnyZodObject, target: Target = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    req[target] = schema.parse(req[target]);
    next();
  };
