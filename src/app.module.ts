import { INestApplication, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { S3ClientModule } from './common/s3-client/s3-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(<string>process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      dropSchema: false, // shouldn't be used in production - may lose data
      synchronize: true, // shouldn't be used in production - may lose data
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AdminModule,
    S3ClientModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  static port: number | string;

  constructor(configService: ConfigService) {
    AppModule.port = configService.get<string>('PORT') || 8080;
  }

  static getBaseUrl(app: INestApplication): string {
    let baseUrl = app.getHttpServer().address().address;
    if (baseUrl == '0.0.0.0' || baseUrl == '::') {
      baseUrl = 'localhost';
    }
    return baseUrl;
  }
}
