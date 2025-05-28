import { GetUser, Public } from '@/common/decorators';
import { RefreshTokenGuard } from '@/common/guards';
import { JWT } from '@/constants';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import {
  SigninDto,
  SignupDto
} from './dtos';
import { TokenEntity } from './entities/token.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'endpoint para fazer login' })
  @ApiResponse({ status: HttpStatus.OK, type: TokenEntity })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Payload recebido é invalido',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'usuário ou senha incorretos',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'algo de inesperado aconteceu internamente no servidor',
  })
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: SigninDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({
    summary: 'endpoint para se registrar',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'O registro foi criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Payload recebido é invalido',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'usuário já existe',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'algo de inesperado aconteceu internamente no servidor',
  })
  signup(@Body() dto: SignupDto) {
    return this.authService.register(dto);
  }

  @Get('refresh-tokens')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth(JWT.REFRESH_TOKEN)
  @ApiOperation({
    summary:
      'endpoint para a atualizar os tokens de autenticação',
  })
  @ApiResponse({ status: HttpStatus.OK, type: TokenEntity })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'refresh token invalido',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'algo de inesperado aconteceu internamente no servidor',
  })
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetUser() user: User) {
    return this.authService.generateAccessTokens(user);
  }
}
