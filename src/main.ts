import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const authUrl = config.get<string>('AUTH_SERVICE_URL')!;
  const catalogUrl = config.get<string>('CATALOG_SERVICE_URL')!;
  const orderUrl = config.get<string>('ORDER_SERVICE_URL')!;

  // Proxy-szabályok: melyik útvonal melyik service-hez megy.
  // Fontos: mount path (app.use('/api/...')) helyett pathFilter, mert a mount
  // path-t az Express levágja, és utána a pathRewrite regexek nem illeszkednek.
  app.use(
    createProxyMiddleware({
      pathFilter: '/api/auth',
      target: authUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '' },
    }),
  );

  app.use(
    createProxyMiddleware({
      pathFilter: '/api/products',
      target: catalogUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/products': '/products' },
    }),
  );

  app.use(
    createProxyMiddleware({
      pathFilter: '/api/orders',
      target: orderUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/orders': '/orders' },
    }),
  );

  await app.listen(config.get<string>('PORT') ?? 8080);
}
bootstrap();
