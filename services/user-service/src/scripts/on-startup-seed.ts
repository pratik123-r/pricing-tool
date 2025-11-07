import { Logger } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from '../features/user/entities/user.entity';
import { PasswordService } from '../features/user/services/password.service';

const logger = new Logger('UserSeed');

export async function seedDefaultUserIfNeeded(orm: MikroORM<PostgreSqlDriver>): Promise<void> {
  const em = orm.em.fork();
  const passwordService = new PasswordService();

  try {
    // Check if any users exist
    const userCount = await em.count(User);
    
    if (userCount === 0) {
      logger.log('No users found. Creating default user...');
      
      // Default user credentials
      const defaultEmail = process.env.DEFAULT_USER_EMAIL || 'admin@example.com';
      const defaultPassword = process.env.DEFAULT_USER_PASSWORD || 'admin123';
      const defaultFirstName = process.env.DEFAULT_USER_FIRST_NAME || 'Admin';
      const defaultLastName = process.env.DEFAULT_USER_LAST_NAME || 'User';

      // Generate salt and hash password
      const salt = await passwordService.generateSalt();
      const hashedPassword = await passwordService.hash(defaultPassword, salt);

      // Create default user
      const defaultUser = em.create(User, {
        firstName: defaultFirstName,
        lastName: defaultLastName,
        email: defaultEmail,
        password: hashedPassword,
        salt,
      });

      await em.persistAndFlush(defaultUser);

      logger.log(`Default user created successfully - Email: ${defaultEmail}, Name: ${defaultFirstName} ${defaultLastName}`);
    }
  } catch (error) {
    logger.error('Error seeding default user', error);
    // Don't throw - allow app to start even if seeding fails
  }
}

