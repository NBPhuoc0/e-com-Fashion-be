import { Module, Global } from '@nestjs/common';
import { S3ClientService } from './services/s3-client.service';

@Global()
@Module({
  providers: [S3ClientService],
  exports: [S3ClientService],
})
export class CommonModule {}
