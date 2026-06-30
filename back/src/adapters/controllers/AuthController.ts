import { Request, Response } from "express";
import { LoginUseCase } from "../../application/auth/LoginUseCase";

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Extract standard credentials from the login form body
      const { email, password } = req.body;

      // 2. Execute the updated use case
      const { token, user } = await this.loginUseCase.execute(email, password);

      // 3. Store the JWT in your HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({ message: "Connexion réussie", user });
    } catch (error: any) {
      const statusCode = error.name === "InvalidCredentialsError" ? 401 : 500;
      res.status(statusCode).json({ message: error.message });
    }
  };

  logout = (req: Request, res: Response): void => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Déconnexion réussie" });
  };
}
