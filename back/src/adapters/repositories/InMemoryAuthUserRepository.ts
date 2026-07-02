import bcrypt from "bcryptjs";
import { User } from "../../domain/entities/User";
import { UserAccountProps } from "../../domain/entities/UserAccount";
import { UserRepository as DomainUserRepository } from "../../domain/ports/UserRepository";
import { UserRepository as PortalUserRepository } from "../../ports/Repositories";

export class InMemoryAuthUserRepository
  implements DomainUserRepository, PortalUserRepository
{
  private readonly byId = new Map<string, any>();
  private readonly byEmail = new Map<string, any>();
  private readonly byAzureId = new Map<string, any>();

  constructor() {
    this.seedDefaultAdmin();
  }

  private seedDefaultAdmin() {
    const admin = new User({
      id: "user-admin",
      azureId: "azure-admin",
      email: "admin@company.com",
      password: bcrypt.hashSync("Admin123!", 10),
      firstName: "Admin",
      lastName: "Portal",
      role: "HR_ADMIN",
      isActive: true,
    });

    this.persist(admin);
  }

  private persist(user: User | any) {
    const record = this.normalizeRecord(user);
    const normalizedEmail = record.email.toLowerCase();

    this.byId.set(record.id, record);
    this.byEmail.set(normalizedEmail, record);

    if (record.azureId) {
      this.byAzureId.set(record.azureId, record);
    }
  }

  private normalizeRecord(user: User | any) {
    if (user instanceof User) {
      return {
        ...user.toJSON(),
        displayName: `${user.firstName} ${user.lastName}`.trim(),
        active: user.isActive,
      };
    }

    return {
      id: user.id,
      azureId: user.azureId,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive ?? user.active ?? true,
      displayName: user.displayName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      active: user.isActive ?? user.active ?? true,
    };
  }

  private toDomainUser(record: any): User {
    return new User({
      id: record.id,
      azureId: record.azureId,
      email: record.email,
      password: record.password,
      firstName: record.firstName,
      lastName: record.lastName,
      role: record.role,
      isActive: record.isActive ?? record.active ?? true,
    });
  }

  private toAccountProps(record: any): UserAccountProps {
    return {
      id: record.id,
      email: record.email,
      displayName: record.displayName ?? `${record.firstName ?? ""} ${record.lastName ?? ""}`.trim(),
      role: record.role,
      active: record.isActive ?? record.active ?? true,
    };
  }

  async list(): Promise<UserAccountProps[]> {
    return Array.from(this.byId.values()).map((record) => this.toAccountProps(record));
  }

  async findById(id: string): Promise<UserAccountProps | undefined> {
    const record = this.byId.get(id);
    return record ? this.toAccountProps(record) : undefined;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = this.byEmail.get(email.toLowerCase());
    return record ? this.toDomainUser(record) : null;
  }

  async findByAzureId(azureId: string): Promise<User | null> {
    const record = this.byAzureId.get(azureId);
    return record ? this.toDomainUser(record) : null;
  }

  async save(user: any): Promise<any> {
    const record = this.normalizeRecord(user);
    this.persist(record);
    return record;
  }
}
