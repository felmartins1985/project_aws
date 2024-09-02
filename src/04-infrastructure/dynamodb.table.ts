import {
  BatchGetItemCommand,
  DynamoDB,
  TransactWriteItemsCommandInput,
} from '@aws-sdk/client-dynamodb';
import { UserDefinition } from 'src/03-model/userdefinition';

import { Item } from './item';
import {
  DynamoDBDocument,
  QueryCommandInput,
  UpdateCommandInput,
  ScanCommandInput,
  TransactWriteCommandOutput,
  GetCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
// import { User } from './item';
import { DynamoTableInterface } from './interface/dynamo-interface';
const marshallOptions = {
  convertEmptyValues: false, // default
  removeUndefinedValues: true, // default
  convertClassInstanceToMap: true, // for data instance to be converted into object
};

const unmarshallOptions = {
  wrapNumbers: false, // default
};

const dynamoDbClient = new DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1',
});

const dynamo = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions,
  unmarshallOptions,
});

export class DynamoTable implements DynamoTableInterface{
  readonly client = dynamo;

  constructor(readonly tableName: string) {}

  async putItem(item: Item<any>) {
    const result = await this.client.put({
      TableName: this.tableName,
      Item: item,
      ReturnValues: 'ALL_OLD',
      ReturnConsumedCapacity: 'TOTAL',
    });
    return result['$metadata'].httpStatusCode === 200;
  }


  async updateItem(params: Partial<UpdateCommandInput>) {
    const updatedParams: UpdateCommandInput = {
      ...params,
      Key: params.Key,
      TableName: this.tableName,
      ReturnValues: 'ALL_NEW',
      ReturnConsumedCapacity: 'TOTAL',
    };

    const result = await this.client.update(updatedParams);
    return result['$metadata'].httpStatusCode === 200;
  }


  async getItems(pk: string): Promise<Item<any>[]> {
    const result = await this.client.query({
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
    return result.Items as Item<any>[];
  }

  async getItem(pk:string, sk: string): Promise<Item<any> > {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key:{
        pk: pk,
        sk: sk
      }
    };
    const result = await this.client.get(params);
    return result.Item as any;
  }
  async query(params: Partial<QueryCommandInput>): Promise<QueryCommandOutput> {
    const result = await this.client.query({
      ...params,
      TableName: this.tableName,
    });
    return result;
  }
}
