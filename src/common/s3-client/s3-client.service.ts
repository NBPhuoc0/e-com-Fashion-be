import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ClientService {
  private logger = new Logger('S3ClientService');
  private client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET');
  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.get('S3_REGION');

    if (!s3_region) {
      this.logger.warn('S3_REGION not found in environment variables');
      throw new Error('S3_REGION not found in environment variables');
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
    });
  }

  async getPresignedSignedUrl(key: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `products/${key}`,
        ACL: 'public-read',
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60, // 1 hours
      });

      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
