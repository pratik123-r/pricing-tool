export interface ITokenGenerationService {
  generate(userId: string): string;
  generateRefreshToken(userId: string): string;
}

