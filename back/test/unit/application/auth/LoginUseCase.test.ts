import { LoginUseCase } from "../../../../src/application/auth/LoginUseCase";
import { UserRepository } from "../../../../src/domain/ports/UserRepository";
import { AuthProvider } from "../../../../src/domain/ports/AuthProvider";
import { User } from "../../../../src/domain/entities/User";
import { InvalidCredentialsError } from "../../../../src/domain/exceptions/InvalidCredentialsError";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let authProvider: jest.Mocked<AuthProvider>;

  beforeEach(() => {
    userRepository = {
      findByAzureId: jest.fn(),
      save: jest.fn(),
    } as any;

    authProvider = {
      validateAzureToken: jest.fn(),
      getUserInfoFromAzure: jest.fn(),
    } as any;

    loginUseCase = new LoginUseCase(userRepository, authProvider);
  });

  describe("execute", () => {
    it("should successfully login an existing user with valid Azure token", async () => {
      const mockAzureUser = {
        azureId: "azure-123",
        email: "john.doe@company.com",
        firstName: "John",
        lastName: "Doe",
      };

      const existingUser = new User({
        id: "user-1",
        azureId: "azure-123",
        email: "john.doe@company.com",
        firstName: "John",
        lastName: "Doe",
        role: "EMPLOYEE",
        isActive: true,
      });

      authProvider.validateAzureToken.mockResolvedValue(true);
      authProvider.getUserInfoFromAzure.mockResolvedValue(mockAzureUser);
      userRepository.findByAzureId.mockResolvedValue(existingUser);

      const result = await loginUseCase.execute("valid-azure-token");

      expect(result).toEqual({
        user: expect.any(User),
        token: expect.any(String),
      });
      expect(userRepository.findByAzureId).toHaveBeenCalledWith("azure-123");
    });

    it("should create a new user if not exists (first login)", async () => {
      const mockAzureUser = {
        azureId: "azure-new",
        email: "new.user@company.com",
        firstName: "Alice",
        lastName: "Wonder",
      };

      authProvider.validateAzureToken.mockResolvedValue(true);
      authProvider.getUserInfoFromAzure.mockResolvedValue(mockAzureUser);
      userRepository.findByAzureId.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({} as any);

      const result = await loginUseCase.execute("valid-azure-token");

      expect(userRepository.save).toHaveBeenCalled();
      expect(result.user.email).toBe("new.user@company.com");
    });

    it("should throw InvalidCredentialsError for invalid token", async () => {
      authProvider.validateAzureToken.mockResolvedValue(false);

      await expect(loginUseCase.execute("invalid-token")).rejects.toThrow(
        InvalidCredentialsError,
      );
    });

    it("should throw error if user is inactive", async () => {
      const inactiveUser = new User({
        id: "user-2",
        azureId: "azure-456",
        email: "inactive@company.com",
        firstName: "Inactive",
        lastName: "User",
        role: "EMPLOYEE",
        isActive: false,
      });

      authProvider.validateAzureToken.mockResolvedValue(true);
      authProvider.getUserInfoFromAzure.mockResolvedValue({} as any);
      userRepository.findByAzureId.mockResolvedValue(inactiveUser);

      await expect(loginUseCase.execute("valid-token")).rejects.toThrow(
        "Account is deactivated",
      );
    });
  });
});
