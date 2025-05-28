import { AuthModule } from './auth/auth.module';
import { ExpensiveModule } from './expensive/expensive.module';
import { UserModule } from './user/user.module';


export const appModules = [
  AuthModule,
  UserModule,
  ExpensiveModule,
] as const;
