import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';



export enum S3SignedUrlOperation {
  getObject = 'getObject',
  putObject = 'putObject',
}

export interface S3BucketInterface {
  bucketName: string;
  
  presigner(key: string, operation: S3SignedUrlOperation): Promise<string>;

  deleteObject(key: string): Promise<DeleteObjectCommandOutput>;

  getObject(key: string, encoding: string): Promise<string>;

  getItem(key: string): Promise<string>;

  getItemBuffer(key: string): Promise<GetObjectCommandOutput>;

  putObject(key: string, body: Buffer): Promise<PutCommandOutput>;

  uploadFile(file: Buffer, key: string): Promise<{ status: boolean; data?: any; message?: string }>;

  listFiles(prefix: string): Promise<ListObjectsCommandOutput>;

  getFileSize(key: string): Promise<HeadObjectCommandOutput>;

  deleteFolder(directory: string): Promise<void>;
}
