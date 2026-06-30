import { AuthProvider } from "../../domain/ports/AuthProvider";

export class AzureAuthProvider implements AuthProvider {
  constructor(private config: { clientId: string; tenantId: string; clientSecret: string }) {}

  async validateAzureToken(token: string): Promise<boolean> {
    // For local testing, accept any token that isn't empty
    return !!token;
  }

  async getUserInfoFromAzure(token: string): Promise<any> {
    // Return dummy data matching what your LoginUseCase expects
    return {
      azureId: "mock-azure-id-12345",
      email: "testuser@bakertilly.mu",
      firstName: "John",
      lastName: "Doe",
    };
  }
}