import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request): Promise<unknown> {
    const authUrl = this.config.get<string>('AUTH_SERVICE_URL');
    const authHeader = req.headers['authorization'];
    const response = await firstValueFrom(
      this.httpService.get<unknown>(`${authUrl}/auth/profile`, {
        headers: { Authorization: authHeader ?? '' },
      }),
    );
    return response.data;
  }
}
