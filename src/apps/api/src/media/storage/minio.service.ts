import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MinioService {
  private readonly s3: S3;
  private readonly bucket: string;
  private readonly logger = new Logger(MinioService.name);

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = Number(this.configService.get<number>('MINIO_PORT', 9000));
    const accessKeyId = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretAccessKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');
    const useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'timon-cms');

    this.s3 = new S3({
      endpoint: `${useSSL ? 'https' : 'http'}://${endpoint}:${port}`,
      accessKeyId,
      secretAccessKey,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
      sslEnabled: useSSL,
    });
  }

  async ensureBucketExists() {
    try {
      const buckets = await this.s3.listBuckets().promise();
      const exists = buckets.Buckets?.some((bucket) => bucket.Name === this.bucket);
      if (!exists) {
        await this.s3.createBucket({ Bucket: this.bucket }).promise();
        this.logger.log(`Bucket ${this.bucket} criado no MinIO`);
      }
    } catch (error) {
      this.logger.error('Erro ao verificar bucket no MinIO', error as Error);
      throw new InternalServerErrorException('Falha na configuração do armazenamento');
    }
  }

  async upload(file: Express.Multer.File, folder?: string) {
    await this.ensureBucketExists();
    const key = `${folder ? `${folder}/` : ''}${uuid()}-${file.originalname}`;

    try {
      const result = await this.s3
        .upload({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        })
        .promise();

      return {
        key,
        url: result.Location,
      };
    } catch (error) {
      this.logger.error('Erro ao enviar arquivo para o MinIO', error as Error);
      throw new InternalServerErrorException('Não foi possível fazer upload do arquivo');
    }
  }

  async remove(key: string) {
    await this.ensureBucketExists();
    try {
      await this.s3.deleteObject({ Bucket: this.bucket, Key: key }).promise();
    } catch (error) {
      this.logger.error('Erro ao remover arquivo do MinIO', error as Error);
      throw new InternalServerErrorException('Não foi possível remover o arquivo');
    }
  }
}
