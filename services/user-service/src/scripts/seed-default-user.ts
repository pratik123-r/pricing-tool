import { Logger } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from '../features/user/entities/user.entity';
import { PasswordService } from '../features/user/services/password.service';

const logger = new Logger('UserSeedScript');

async function seedDefaultUser() {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    driver: PostgreSqlDriver,
    host: process.env.USER_SERVICE_DB_HOST || 'localhost',
    port: parseInt(process.env.USER_SERVICE_DB_PORT || '5432'),
    user: process.env.USER_SERVICE_DB_USER || 'postgres',
    password: process.env.USER_SERVICE_DB_PASSWORD || 'pratik',
    dbName: process.env.USER_SERVICE_DB_NAME || 'user_db',
    entities: [User],
  });

  const em = orm.em.fork();
  const passwordService = new PasswordService();

  try {
    const userCount = await em.count(User);
    
    if (userCount === 0) {
      logger.log('No users found. Creating default user...');
      
      const defaultEmail = process.env.DEFAULT_USER_EMAIL || 'admin@example.com';
      const defaultPassword = process.env.DEFAULT_USER_PASSWORD || 'admin123';
      const defaultFirstName = process.env.DEFAULT_USER_FIRST_NAME || 'Admin';
      const defaultLastName = process.env.DEFAULT_USER_LAST_NAME || 'User';

      const salt = await passwordService.generateSalt();
      const hashedPassword = await passwordService.hash(defaultPassword, salt);

      const defaultUser = em.create(User, {
        firstName: defaultFirstName,
        lastName: defaultLastName,
        email: defaultEmail,
        password: hashedPassword,
        salt,
      });

      await em.persistAndFlush(defaultUser);

      logger.log(`Default user created successfully - Email: ${defaultEmail}, Name: ${defaultFirstName} ${defaultLastName}`);
    } else {
      logger.log(`Users already exist (${userCount} user(s)). Skipping default user creation.`);
    }
  } catch (error) {
    logger.error('Error seeding default user', error);
    throw error;
  } finally {
    await orm.close();
  }
}

seedDefaultUser().catch((err) => {
  const logger = new Logger('UserSeedScript');
  logger.error('Failed to seed default user', err);
  process.exit(1);
});

