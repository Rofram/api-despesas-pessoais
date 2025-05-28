import { JWT } from '@/constants';
import { AuthGuard } from '@nestjs/passport';

/* This class extends the AuthGuard class and uses the jwt-refresh strategy. */
export class RefreshTokenGuard extends AuthGuard(JWT.REFRESH_TOKEN) {}
