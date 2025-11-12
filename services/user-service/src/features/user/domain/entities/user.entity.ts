export class User {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly salt: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isValid(): boolean {
    return !!this.email && !!this.firstName && !!this.lastName;
  }
}

