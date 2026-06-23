import express from 'express'
import { createRoutes } from './adapters/http/routes'
import { actorMiddleware } from './adapters/http/context'
import {
  MemoryAnnouncementRepository,
  MemoryDepartmentRepository,
  MemoryEmployeeRepository,
  MemoryFeedbackRepository,
  MemoryUserRepository,
} from './adapters/repositories/MemoryRepositories'
import { PortalUseCases } from './application/usecases/PortalUseCases'
import { memoryDatabase } from './infrastructure/database/MemoryDatabase'
import { errorHandler } from './infrastructure/middleware/errorHandler'
import { requestLogger } from './infrastructure/middleware/requestLogger'

const app = express()
const userRepository = new MemoryUserRepository(memoryDatabase)
const useCases = new PortalUseCases(
  new MemoryDepartmentRepository(memoryDatabase),
  new MemoryEmployeeRepository(memoryDatabase),
  userRepository,
  new MemoryAnnouncementRepository(memoryDatabase),
  new MemoryFeedbackRepository(memoryDatabase)
)

app.use(express.json())
app.use(requestLogger)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  next()
})
app.options('*', (_req, res) => res.sendStatus(204))

app.use('/api', actorMiddleware(userRepository), createRoutes(useCases))

app.use(errorHandler)

export default app
