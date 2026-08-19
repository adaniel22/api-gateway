import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  async findAll(): Promise<unknown> {
    const orderUrl = this.config.get<string>('ORDER_SERVICE_URL');
    const response = await firstValueFrom(
      this.httpService.get<unknown>(`${orderUrl}/orders`),
    );
    return response.data;
  }

  @Post()
  async create(@Body() body: unknown): Promise<unknown> {
    const orderUrl = this.config.get<string>('ORDER_SERVICE_URL');
    const response = await firstValueFrom(
      this.httpService.post<unknown>(`${orderUrl}/orders`, body),
    );
    return response.data;
  }
}
