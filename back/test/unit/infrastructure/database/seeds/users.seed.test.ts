// tests/unit/infrastructure/database/seeds/users.seed.test.ts
import { seedUsers, usersData } from '../../../../../src/infrastructure/database/seeds/users.seed';
import { User } from '../../../../../src/domain/entities/User';

describe('Users Seed', () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue({}),
    };
  });

  it('should seed all users', async () => {
    await seedUsers(mockRepository);

    expect(mockRepository.save).toHaveBeenCalledTimes(usersData.length);
  });

  it('should create valid User entities', async () => {
    await seedUsers(mockRepository);

    usersData.forEach((data, index) => {
      const call = mockRepository.save.mock.calls[index][0];
      expect(call).toBeInstanceOf(User);
      expect(call.email).toBe(data.email);
      expect(call.azureId).toBe(data.azureId);
      expect(call.role).toBe(data.role);
    });
  });

  it('should include at least one HR Admin', () => {
    const hrAdmin = usersData.find(u => u.role === 'HR_ADMIN');
    expect(hrAdmin).toBeDefined();
  });
});