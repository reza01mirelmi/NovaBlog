import express, { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

const validObjectId =
  (paramName: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const idFromParams = req.params[paramName];
      const idFromBody = req.body?.[paramName];

      if (!idFromParams && !idFromBody) {
        return res.status(400).json({ message: "ID is required" });
      }

      if (idFromParams && !isValidObjectId(idFromParams)) {
        return res.status(400).json({ message: "ID param is invalid" });
      }

      if (idFromBody && !isValidObjectId(idFromBody)) {
        return res.status(400).json({ message: "ID in body is invalid" });
      }

      return next();
    } catch (err) {
      next(err);
    }
  };

export default validObjectId;
