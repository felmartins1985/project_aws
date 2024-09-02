import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { Message } from './message-sqs';

const client = new SQSClient({
  region: 'us-east-1',
});

export class SqsHandler {
  readonly sqs = client;

  constructor(readonly sqsUrl: string) {}

  async sendMessage(message: Message) {
    const params: SendMessageCommandInput = {
      MessageBody: message.MessageBody,
      QueueUrl: this.sqsUrl,
      MessageGroupId: message.MessageGroupId,
      MessageDeduplicationId: message.MessageDeduplicationId,
    };
    const command = new SendMessageCommand(params);
    return client.send(command);
  }
}
