import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Pool } from "pg";

import { PostgreSqlUserRepository } from "./adapters/repositories/PostgreSqlUserRepository";
import { AuthController } from "./adapters/controllers/AuthController";
import { LoginUseCase } from "./application/auth/LoginUseCase";
import { createRoutes } from "./adapters/http/routes";
import { actorMiddleware } from "./adapters/http/context";
import { PortalUseCases } from "./application/usecases/PortalUseCases";
import { memoryDatabase } from "./infrastructure/database/MemoryDatabase";
import { errorHandler } from "./infrastructure/middleware/errorHandler";
import { requestLogger } from "./infrastructure/middleware/requestLogger";
import {
  MemoryAnnouncementRepository,
  MemoryDepartmentRepository,
  MemoryEmployeeRepository,
  MemoryFeedbackRepository,
  MemoryUserRepository,
} from "./adapters/repositories/MemoryRepositories";

const app = express();

// ====================== DATABASE ======================
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ====================== DEPENDENCIES ======================
const sqlUserRepository = new PostgreSqlUserRepository(dbPool);

// Cleaned up: No more AzureAuthProvider instance required!
const loginUseCase = new LoginUseCase(sqlUserRepository);
const authController = new AuthController(loginUseCase);

// ====================== MEMORY REPOSITORIES (Legacy) ======================
const memoryUserRepository = new MemoryUserRepository(memoryDatabase);
const useCases = new PortalUseCases(
  new MemoryDepartmentRepository(memoryDatabase),
  new MemoryEmployeeRepository(memoryDatabase),
  memoryUserRepository,
  new MemoryAnnouncementRepository(memoryDatabase),
  new MemoryFeedbackRepository(memoryDatabase),
);

// ====================== MIDDLEWARES ======================
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-User-Id"],
  }),
);

// ====================== ROUTES ======================
app.use(
  "/api",
  actorMiddleware(memoryUserRepository),
  createRoutes(useCases, authController),
);

app.use(errorHandler);

export default app;
