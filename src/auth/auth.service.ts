import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.buildTokens(user.id, user.email, user.role);
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET },
      );
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = await this.usersService.findOne(payload.sub);

    if (!user.active) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return this.buildTokens(user.id, user.email, user.role);
  }

  private buildTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessExpiration = process.env.JWT_ACCESS_EXPIRATION ?? '15m';
    const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION ?? '7d';

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: accessExpiration as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: refreshExpiration as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
      user: {
        id: userId,
        email,
        role,
      },
    };
  }
}
