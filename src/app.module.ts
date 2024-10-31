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
import { PromotionsModule } from './promotion/promotions.module';

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
      dropSchema: false, //!!
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AdminModule,
    S3ClientModule,
    PromotionsModule,
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
