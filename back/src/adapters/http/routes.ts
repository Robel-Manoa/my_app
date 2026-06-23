import { Router } from 'express'
import {
  announcementCreateSchema,
  announcementUpdateSchema,
  departmentCreateSchema,
  departmentUpdateSchema,
  employeeCreateSchema,
  employeeUpdateSchema,
  feedbackCloseSchema,
  feedbackCreateSchema,
  feedbackReviewSchema,
  idParamSchema,
  loginSchema,
} from '../../application/schemas/contracts'
import { PortalUseCases } from '../../application/usecases/PortalUseCases'
import { requireActor } from './context'
import { validateBody, validateParams } from './validate'

const routeId = (value: string | undefined) => value || ''

export const createRoutes = (useCases: PortalUseCases) => {
  const router = Router()

  router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'internal-company-portal' }))
  router.post('/auth/login', validateBody(loginSchema), async (req, res, next) => {
    try { res.json(await useCases.login(req.body.email)) } catch (error) { next(error) }
  })
  router.get('/auth/me', async (req, res, next) => {
    try { res.json(await useCases.me(requireActor(req))) } catch (error) { next(error) }
  })
  router.get('/users', async (req, res, next) => {
    try { res.json(await useCases.listUsers(requireActor(req))) } catch (error) { next(error) }
  })

  router.get('/departments', async (_req, res, next) => {
    try { res.json(await useCases.listDepartments()) } catch (error) { next(error) }
  })
  router.post('/departments', validateBody(departmentCreateSchema), async (req, res, next) => {
    try { res.status(201).json(await useCases.createDepartment(requireActor(req), req.body)) } catch (error) { next(error) }
  })
  router.put('/departments/:id', validateParams(idParamSchema), validateBody(departmentUpdateSchema), async (req, res, next) => {
    try { res.json(await useCases.updateDepartment(requireActor(req), routeId(req.params.id), req.body)) } catch (error) { next(error) }
  })
  router.delete('/departments/:id', validateParams(idParamSchema), async (req, res, next) => {
    try { await useCases.deleteDepartment(requireActor(req), routeId(req.params.id)); res.status(204).send() } catch (error) { next(error) }
  })

  router.get('/employees', async (req, res, next) => {
    try { res.json(await useCases.listEmployees(requireActor(req))) } catch (error) { next(error) }
  })
  router.post('/employees', validateBody(employeeCreateSchema), async (req, res, next) => {
    try { res.status(201).json(await useCases.createEmployee(requireActor(req), req.body)) } catch (error) { next(error) }
  })
  router.put('/employees/:id', validateParams(idParamSchema), validateBody(employeeUpdateSchema), async (req, res, next) => {
    try { res.json(await useCases.updateEmployee(requireActor(req), routeId(req.params.id), req.body)) } catch (error) { next(error) }
  })
  router.delete('/employees/:id', validateParams(idParamSchema), async (req, res, next) => {
    try { await useCases.deleteEmployee(requireActor(req), routeId(req.params.id)); res.status(204).send() } catch (error) { next(error) }
  })

  router.get('/announcements', async (req, res, next) => {
    try { res.json(await useCases.listAnnouncements(requireActor(req))) } catch (error) { next(error) }
  })
  router.post('/announcements', validateBody(announcementCreateSchema), async (req, res, next) => {
    try { res.status(201).json(await useCases.createAnnouncement(requireActor(req), req.body)) } catch (error) { next(error) }
  })
  router.put('/announcements/:id', validateParams(idParamSchema), validateBody(announcementUpdateSchema), async (req, res, next) => {
    try { res.json(await useCases.updateAnnouncement(requireActor(req), routeId(req.params.id), req.body)) } catch (error) { next(error) }
  })
  router.post('/announcements/:id/publish', validateParams(idParamSchema), async (req, res, next) => {
    try { res.json(await useCases.publishAnnouncement(requireActor(req), routeId(req.params.id))) } catch (error) { next(error) }
  })
  router.post('/announcements/:id/archive', validateParams(idParamSchema), async (req, res, next) => {
    try { res.json(await useCases.archiveAnnouncement(requireActor(req), routeId(req.params.id))) } catch (error) { next(error) }
  })

  router.get('/feedback', async (req, res, next) => {
    try { res.json(await useCases.listFeedback(requireActor(req))) } catch (error) { next(error) }
  })
  router.post('/feedback', validateBody(feedbackCreateSchema), async (req, res, next) => {
    try { res.status(201).json(await useCases.submitFeedback(requireActor(req), req.body)) } catch (error) { next(error) }
  })
  router.post('/feedback/:id/review', validateParams(idParamSchema), validateBody(feedbackReviewSchema), async (req, res, next) => {
    try { res.json(await useCases.reviewFeedback(requireActor(req), routeId(req.params.id), req.body.reviewNote)) } catch (error) { next(error) }
  })
  router.post('/feedback/:id/close', validateParams(idParamSchema), validateBody(feedbackCloseSchema), async (req, res, next) => {
    try { res.json(await useCases.closeFeedback(requireActor(req), routeId(req.params.id), req.body.closeNote)) } catch (error) { next(error) }
  })

  return router
}
