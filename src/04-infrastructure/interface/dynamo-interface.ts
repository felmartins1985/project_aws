import {
  DynamoDBDocument,
  GetCommandInput,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateCommandInput,
  PutCommandOutput,
  DeleteCommandOutput,
} from '@aws-sdk/lib-dynamodb';

export interface DynamoTableInterface{
  client: DynamoDBDocument;
  tableName: string;
  putItem(item: any): Promise<boolean>;
  updateItem(params: Partial<UpdateCommandInput>): Promise<boolean>;
  getItems(pk: string): Promise<any[]>;
  getItem(pk: string, sk: string): Promise<any>;
  query(params: Partial<QueryCommandInput>): Promise<QueryCommandOutput>
}