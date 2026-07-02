import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Pool } from "pg";

import { AuthController } from "./adapters/controllers/AuthController";
import { LoginUseCase } from "./application/auth/LoginUseCase";
import { RegisterUseCase } from "./application/auth/RegisterUseCase";
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
import { InMemoryAuthUserRepository } from "./adapters/repositories/InMemoryAuthUserRepository";

const app = express();
app.disable("x-powered-by");

const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const authUserRepository = new InMemoryAuthUserRepository();
const loginUseCase = new LoginUseCase(authUserRepository);
const registerUseCase = new RegisterUseCase(authUserRepository);
const authController = new AuthController(loginUseCase, registerUseCase);

const memoryUserRepository = new MemoryUserRepository(memoryDatabase);
const useCases = new PortalUseCases(
  new MemoryDepartmentRepository(memoryDatabase),
  new MemoryEmployeeRepository(memoryDatabase),
  memoryUserRepository,
  new MemoryAnnouncementRepository(memoryDatabase),
  new MemoryFeedbackRepository(memoryDatabase),
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-User-Id"],
  }),
);

app.use(
  "/api",
  actorMiddleware({
    findById: (id) => authUserRepository.findAccountById(id),
    findByEmail: (email) => authUserRepository.findAccountByEmail(email),
  }),
  createRoutes(useCases, authController),
);

app.use(errorHandler);

export default app;
