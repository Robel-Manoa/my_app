import { Pool, QueryResult } from "pg";
import { UserRepository } from "../../domain/ports/UserRepository";
import { User } from "../../domain/entities/User";

export class PostgreSqlUserRepository implements UserRepository {
  constructor(private db: Pool) {}

  /**
   * Recherche un utilisateur par email (utilisé pour le login classique)
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT 
        id,
        azure_id,
        email,
        password,           -- Obligatoire pour la comparaison bcrypt
        first_name,
        last_name,
        role,
        is_active,
        created_at,
        updated_at
      FROM users 
      WHERE email = $1 
      LIMIT 1;
    `;

    try {
      const result: QueryResult = await this.db.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];

      return new User({
        id: row.id,
        azureId: row.azure_id,
        email: row.email,
        password: row.password, // Important pour LoginUseCase
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error) {
      console.error("Erreur dans findByEmail:", error);
      throw new Error("Erreur lors de la recherche de l'utilisateur");
    }
  }

  /**
   * Recherche par Azure ID (utile pour l'authentification Azure AD)
   */
  async findByAzureId(azureId: string): Promise<User | null> {
    const query = `
      SELECT 
        id,
        azure_id,
        email,
        password,
        first_name,
        last_name,
        role,
        is_active,
        created_at,
        updated_at
      FROM users 
      WHERE azure_id = $1 
      LIMIT 1;
    `;

    try {
      const result: QueryResult = await this.db.query(query, [azureId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];

      return new User({
        id: row.id,
        azureId: row.azure_id,
        email: row.email,
        password: row.password,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error) {
      console.error("Erreur dans findByAzureId:", error);
      throw error;
    }
  }

  /**
   * Recherche par ID interne
   */
  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT 
        id, azure_id, email, password, first_name, last_name, 
        role, is_active, created_at, updated_at
      FROM users 
      WHERE id = $1 
      LIMIT 1;
    `;

    try {
      const result: QueryResult = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];

      return new User({
        id: row.id,
        azureId: row.azure_id,
        email: row.email,
        password: row.password,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error) {
      console.error("Erreur dans findById:", error);
      throw error;
    }
  }

  /**
   * Sauvegarde ou met à jour un utilisateur (Upsert)
   */
  async save(user: User): Promise<void> {
    const query = `
      INSERT INTO users (
        id,
        azure_id,
        email,
        password,
        first_name,
        last_name,
        role,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (azure_id) DO UPDATE 
      SET 
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();
    `;

    try {
      const values = [
        user.id,
        user.azureId,
        user.email,
        user.password || null, // Permet de mettre à jour le mot de passe
        user.firstName,
        user.lastName,
        user.role,
        user.isActive,
      ];

      await this.db.query(query, values);
    } catch (error) {
      console.error("Erreur dans save:", error);
      throw new Error("Erreur lors de la sauvegarde de l'utilisateur");
    }
  }
}
