import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ForbiddenError } from "../../domain/exceptions/DomainError";
import { Actor } from "../../domain/model/types";
import { UserRepository } from "../../ports/Repositories";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-portal-key";

declare global {
  namespace Express {
    interface Request {
      actor?: Actor;
    }
  }
}

export const actorMiddleware =
  (users: UserRepository) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (
        req.path === "/auth/login" ||
        req.path === "/auth/register" ||
        req.path === "/health"
      ) {
        return next();
      }

      const token =
        req.header("x-user-id") ||
        req.header("authorization")?.replace(/^Bearer\s+/i, "") ||
        req.cookies?.token;

      if (!token) {
        throw new ForbiddenError("Missing mock Azure AD token");
      }

      const directUser = await users.findById(token);
      if (directUser && directUser.active) {
        req.actor = {
          id: directUser.id,
          email: directUser.email,
          role: directUser.role,
          ...(directUser.departmentId
            ? { departmentId: directUser.departmentId }
            : {}),
          ...(directUser.employeeId
            ? { employeeId: directUser.employeeId }
            : {}),
        };
        return next();
      }

      let decoded: any = null;
      try {
        decoded = jwt.verify(token, JWT_SECRET) as any;
      } catch {
        decoded = null;
      }

      if (decoded?.sub) {
        const resolvedUser = await users.findById(decoded.sub);
        if (resolvedUser && resolvedUser.active) {
          req.actor = {
            id: resolvedUser.id,
            email: resolvedUser.email,
            role: resolvedUser.role,
            ...(resolvedUser.departmentId
              ? { departmentId: resolvedUser.departmentId }
              : {}),
            ...(resolvedUser.employeeId
              ? { employeeId: resolvedUser.employeeId }
              : {}),
          };
          return next();
        }
      }

      if (decoded?.email) {
        const resolvedUser = await users.findByEmail(decoded.email);
        if (resolvedUser && resolvedUser.active) {
          req.actor = {
            id: resolvedUser.id,
            email: resolvedUser.email,
            role: resolvedUser.role,
            ...(resolvedUser.departmentId
              ? { departmentId: resolvedUser.departmentId }
              : {}),
            ...(resolvedUser.employeeId
              ? { employeeId: resolvedUser.employeeId }
              : {}),
          };
          return next();
        }
      }

      throw new ForbiddenError("Invalid mock Azure AD token");
    } catch (error) {
      next(error);
    }
  };

export const requireActor = (req: Request): Actor => {
  if (!req.actor) throw new ForbiddenError("Authentication required");
  return req.actor;
};
