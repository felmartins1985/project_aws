import { MessageAttributeValue } from '@aws-sdk/client-sqs';

export abstract class Message {
  MessageGroupId: string;
  MessageBody: string;
  MessageDeduplicationId: string;
}
