import { RegisterUseCase } from '../../../../src/application/auth/RegisterUseCase';
import { UserRepository } from '../../../../src/domain/ports/UserRepository';
import { User } from '../../../../src/domain/entities/User';
import { UserAlreadyExistsError } from '../../../../src/domain/exceptions/UserAlreadyExistsError';
import { InvalidInputError } from '../../../../src/domain/exceptions/InvalidInputError';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockRegisterInput = {
    azureId: 'azure-12345',
    email: 'jane.doe@company.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'EMPLOYEE' as const,
  };

  beforeEach(() => {
    userRepository = {
      findByAzureId: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as any;

    registerUseCase = new RegisterUseCase(userRepository);
  });

  describe('execute', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      userRepository.findByAzureId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({ id: 'user-new-123' } as any);

      // Act
      const result = await registerUseCase.execute(mockRegisterInput);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('user-new-123');
      expect(result.email).toBe('jane.doe@company.com');
      expect(userRepository.findByAzureId).toHaveBeenCalledWith('azure-12345');
      expect(userRepository.findByEmail).toHaveBeenCalledWith('jane.doe@company.com');
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw UserAlreadyExistsError if user with same Azure ID already exists', async () => {
      const existingUser = new User({
        id: 'user-1',
        azureId: 'azure-12345',
        email: 'jane.doe@company.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        isActive: true,
      });

      userRepository.findByAzureId.mockResolvedValue(existingUser);

      await expect(registerUseCase.execute(mockRegisterInput))
        .rejects.toThrow(UserAlreadyExistsError);
    });

    it('should throw UserAlreadyExistsError if email is already used', async () => {
      userRepository.findByAzureId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue({} as any);

      await expect(registerUseCase.execute(mockRegisterInput))
        .rejects.toThrow(UserAlreadyExistsError);
    });

    it('should throw InvalidInputError if email is invalid', async () => {
      const invalidInput = { ...mockRegisterInput, email: 'invalid-email' };

      await expect(registerUseCase.execute(invalidInput))
        .rejects.toThrow(InvalidInputError);
    });

    it('should throw InvalidInputError if required fields are missing', async () => {
      const incompleteInput = {
        azureId: 'azure-999',
        email: '',
        firstName: '',
        lastName: '',
        role: 'EMPLOYEE' as const,
      };

      await expect(registerUseCase.execute(incompleteInput))
        .rejects.toThrow(InvalidInputError);
    });

    it('should set default role to EMPLOYEE if not provided', async () => {
      const inputWithoutRole = { ...mockRegisterInput };
      delete (inputWithoutRole as any).role;

      userRepository.findByAzureId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({ id: 'user-xyz' } as any);

      const result = await registerUseCase.execute(inputWithoutRole);

      expect(result.role).toBe('EMPLOYEE');
    });
  });
});