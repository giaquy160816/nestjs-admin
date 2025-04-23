import { JwtService } from '@nestjs/jwt';
import configuration from '../../config/configuration';

export function generateTokens(jwtService: JwtService, payload: { 
    sub: number; 
    email: string;
    fullname?: string;
    roles?: string;
}) {
    const accessToken = jwtService.sign(payload, {
        secret: configuration().jwt.secret,
        expiresIn: configuration().jwt.expires,
    });
    const refreshToken = jwtService.sign(payload, {
        secret: configuration().jwt.refresh,
        expiresIn: configuration().jwt.refreshExpires,
    });
    return {
        accessToken,
        refreshToken,
        expiresIn: configuration().jwt.expires,
        refreshExpiresIn: configuration().jwt.refreshExpires,
    };
} 