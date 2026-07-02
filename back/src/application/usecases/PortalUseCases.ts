import { v4 as uuid } from "uuid";
import { Announcement } from "../../domain/entities/Announcement";
import { Department } from "../../domain/entities/Department";
import { Employee } from "../../domain/entities/Employee";
import { Feedback } from "../../domain/entities/Feedback";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../domain/exceptions/DomainError";
import { Actor } from "../../domain/model/types";
import {
  AnnouncementRepository,
  DepartmentRepository,
  EmployeeRepository,
  FeedbackRepository,
  UserRepository,
} from "../../ports/Repositories";
import { AuthorizationService } from "../security/AuthorizationService";

interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  departmentId: string;
  managerId?: string;
  status?: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  salaryBand?: string;
}

export class PortalUseCases {
  constructor(
    private readonly departments: DepartmentRepository,
    private readonly employees: EmployeeRepository,
    private readonly users: UserRepository,
    private readonly announcements: AnnouncementRepository,
    private readonly feedbacks: FeedbackRepository,
    private readonly authz = new AuthorizationService(),
  ) {}

  async login(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.active)
      throw new ForbiddenError(
        "Mock Azure AD user is not active or does not exist",
      );
    return { user, token: user.id };
  }

  async me(actor: Actor) {
    const user = await this.users.findById(actor.id);
    if (!user) throw new NotFoundError("User");
    const employee = user.employeeId
      ? await this.employees.findById(user.employeeId)
      : undefined;
    return { user, employee };
  }

  async listUsers(actor: Actor) {
    this.authz.requireHrOrDepartmentAdmin(actor);
    const users = await this.users.list();
    return actor.role === "HR_ADMIN"
      ? users
      : users.filter((user) => user.departmentId === actor.departmentId);
  }

  async listDepartments() {
    return this.departments.list();
  }

  async createDepartment(
    actor: Actor,
    input: { name: string; code: string; description: string },
  ) {
    this.authz.requireHr(actor);
    const existing = await this.departments.findByCode(input.code);
    if (existing) throw new ConflictError("Department code must be unique");
    const department = Department.create({ id: uuid(), ...input }).toJSON();
    return this.departments.save(department);
  }

  async updateDepartment(
    actor: Actor,
    id: string,
    input: Partial<{
      name: string;
      code: string;
      description: string;
      active: boolean;
    }>,
  ) {
    this.authz.requireHr(actor);
    const existing = await this.departments.findById(id);
    if (!existing) throw new NotFoundError("Department");
    if (input.code) {
      const duplicate = await this.departments.findByCode(input.code);
      if (duplicate && duplicate.id !== id)
        throw new ConflictError("Department code must be unique");
    }
    return this.departments.save(
      Department.rehydrate(existing).update(input).toJSON(),
    );
  }

  async deleteDepartment(actor: Actor, id: string) {
    this.authz.requireHr(actor);
    const assigned = (await this.employees.list()).some(
      (employee) => employee.departmentId === id,
    );
    if (assigned)
      throw new ConflictError(
        "Cannot delete a department with assigned employees",
      );
    await this.departments.delete(id);
  }

  async listEmployees(actor: Actor) {
    this.authz.requireHrOrDepartmentAdmin(actor);
    const rows = this.authz.filterDepartmentRows(
      actor,
      await this.employees.list(),
    );
    return rows.map((employee) =>
      this.authz.stripSensitiveEmployeeFields(actor, employee),
    );
  }

  async createEmployee(actor: Actor, input: EmployeeInput) {
    this.authz.requireHrOrDepartmentAdmin(actor);
    this.authz.canManageDepartment(actor, input.departmentId);
    const department = await this.departments.findById(input.departmentId);
    if (!department || !department.active)
      throw new NotFoundError("Active department");
    const employee = Employee.create({
      id: uuid(),
      userId: `user-${uuid()}`,
      ...input,
    }).toJSON();
    return this.employees.save(employee);
  }

  async updateEmployee(
    actor: Actor,
    id: string,
    input: Partial<EmployeeInput>,
  ) {
    const existing = await this.employees.findById(id);
    if (!existing) throw new NotFoundError("Employee");
    this.authz.requireHrOrDepartmentAdmin(actor);
    this.authz.canManageDepartment(actor, existing.departmentId);
    if (input.departmentId)
      this.authz.canManageDepartment(actor, input.departmentId);
    return this.employees.save(
      Employee.rehydrate(existing).update(input).toJSON(),
    );
  }

  async deleteEmployee(actor: Actor, id: string) {
    this.authz.requireHr(actor);
    await this.employees.delete(id);
  }

  async listAnnouncements(actor: Actor) {
    const rows = await this.announcements.list();
    if (actor.role === "HR_ADMIN") return rows;
    return rows.filter(
      (item) =>
        item.status === "PUBLISHED" &&
        (!item.departmentId || item.departmentId === actor.departmentId),
    );
  }

  async createAnnouncement(
    actor: Actor,
    input: { title: string; body: string; departmentId?: string },
  ) {
    this.authz.requireHrOrDepartmentAdmin(actor);
    if (actor.role === "DEPARTMENT_ADMIN") {
      this.authz.canManageDepartment(actor, input.departmentId);
    }
    const announcement = Announcement.create({
      id: uuid(),
      authorId: actor.id,
      ...input,
    }).toJSON();
    return this.announcements.save(announcement);
  }

  async updateAnnouncement(
    actor: Actor,
    id: string,
    input: Partial<{ title: string; body: string; departmentId?: string }>,
  ) {
    const existing = await this.announcements.findById(id);
    if (!existing) throw new NotFoundError("Announcement");
    this.authz.requireHrOrDepartmentAdmin(actor);
    if (actor.role === "DEPARTMENT_ADMIN")
      this.authz.canManageDepartment(actor, existing.departmentId);
    return this.announcements.save(
      Announcement.rehydrate(existing).updateDraft(input).toJSON(),
    );
  }

  async publishAnnouncement(actor: Actor, id: string) {
    const existing = await this.announcements.findById(id);
    if (!existing) throw new NotFoundError("Announcement");
    this.authz.requireHrOrDepartmentAdmin(actor);
    if (actor.role === "DEPARTMENT_ADMIN")
      this.authz.canManageDepartment(actor, existing.departmentId);
    return this.announcements.save(
      Announcement.rehydrate(existing).publish().toJSON(),
    );
  }

  async archiveAnnouncement(actor: Actor, id: string) {
    this.authz.requireHr(actor);
    const existing = await this.announcements.findById(id);
    if (!existing) throw new NotFoundError("Announcement");
    return this.announcements.save(
      Announcement.rehydrate(existing).archive().toJSON(),
    );
  }

  async submitFeedback(
    actor: Actor,
    input: { subject: string; message: string },
  ) {
    if (actor.role !== "EMPLOYEE") {
      throw new ForbiddenError("Only employee users can submit feedback");
    }

    const employeeId = actor.employeeId || `employee-${actor.id}`;
    const departmentId = actor.departmentId || "dept-general";

    const feedback = Feedback.submit({
      id: uuid(),
      employeeId,
      departmentId,
      ...input,
    }).toJSON();

    return this.feedbacks.save(feedback);
  }

  async listFeedback(actor: Actor) {
    const rows = await this.feedbacks.list();
    if (actor.role === "HR_ADMIN") return rows;
    if (actor.role === "DEPARTMENT_ADMIN") {
      return rows.filter((item) => item.departmentId === actor.departmentId);
    }

    const employeeId = actor.employeeId || `employee-${actor.id}`;
    return rows.filter((item) => item.employeeId === employeeId);
  }

  async reviewFeedback(actor: Actor, id: string, reviewNote: string) {
    this.authz.requireHrOrDepartmentAdmin(actor);
    const existing = await this.feedbacks.findById(id);
    if (!existing) throw new NotFoundError("Feedback");
    this.authz.canManageDepartment(actor, existing.departmentId);
    return this.feedbacks.save(
      Feedback.rehydrate(existing).review(actor.id, reviewNote).toJSON(),
    );
  }

  async closeFeedback(actor: Actor, id: string, closeNote: string) {
    this.authz.requireHrOrDepartmentAdmin(actor);
    const existing = await this.feedbacks.findById(id);
    if (!existing) throw new NotFoundError("Feedback");
    this.authz.canManageDepartment(actor, existing.departmentId);
    return this.feedbacks.save(
      Feedback.rehydrate(existing).close(closeNote).toJSON(),
    );
  }
}
