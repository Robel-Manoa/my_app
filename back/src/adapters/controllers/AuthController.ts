import { Request, Response } from "express";
import { LoginUseCase } from "../../application/auth/LoginUseCase";
import { RegisterUseCase } from "../../application/auth/RegisterUseCase";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase?: RegisterUseCase,
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.loginUseCase.execute(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Connexion réussie", user, token });
    } catch (error: any) {
      const statusCode = error.name === "InvalidCredentialsError" ? 401 : 500;
      res.status(statusCode).json({ message: error.message || "Erreur d'authentification" });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!this.registerUseCase) {
        res.status(500).json({ message: "Register service unavailable" });
        return;
      }

      const { email, firstName, lastName, password, role } = req.body;
      const user = await this.registerUseCase.execute({
        email,
        firstName,
        lastName,
        password,
        role,
      });

      res.status(201).json({ message: "Employé enregistré", user });
    } catch (error: any) {
      const statusCode = error.name === "UserAlreadyExistsError" ? 409 : 400;
      res.status(statusCode).json({ message: error.message || "Impossible d'enregistrer l'employé" });
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
