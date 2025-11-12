export class UserContext {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly roles: string[],
    public readonly token: string,
  ) {
    if (!userId || !email || !token) {
      throw new Error('UserContext requires userId, email, and token');
    }
  }

  toPlainObject() {
    return {
      userId: this.userId,
      email: this.email,
      roles: this.roles,
      token: this.token,
    };
  }

  static fromPlainObject(data: any): UserContext {
    return new UserContext(
      data.userId,
      data.email,
      data.roles || [],
      data.token,
    );
  }
}

