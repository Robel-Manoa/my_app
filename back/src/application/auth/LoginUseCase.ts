import { UserRepository } from "../../domain/ports/UserRepository";
import { InvalidCredentialsError } from "../../domain/exceptions/InvalidCredentialsError";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Used for secure password comparison

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-portal-key";
const JWT_EXPIRES_IN = "1d";

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {} // Cleaned up AuthProvider

  async execute(email: string, password?: string) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // 1. Find the user by their email in Postgres
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // 2. Guard clause: Block deactivated accounts
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    // 3. Verify the password matches the hashed password in the database
    // Note: Assuming your domain User entity exposes user.password
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // 4. Generate your stateless session JWT
    const appToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return {
      user,
      token: appToken,
    };
  }
}
