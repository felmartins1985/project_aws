import { SQSEvent, SQSRecord } from 'aws-lambda';
import { UserService } from 'src/02-services/user.service';
import { BookService } from 'src/02-services/book.service';
import { DynamoTable } from 'src/04-infrastructure/dynamodb.table';
import {AxiosAdapter} from 'src/03-model/axios-adapter';
export const handler = async (event: SQSEvent) => {
  try {
    const httpClient = new AxiosAdapter();
    const dynamoTable = new DynamoTable(process.env.TABLE_NAME);
    const bookService = new BookService(dynamoTable, httpClient);
    const userService = new UserService(dynamoTable, bookService);
    const records: SQSRecord[] = event.Records;
    const updatePromises: Promise<any>[] = [];
    JSON.stringify(event.Records, null, 2);
    for (const record of records) {
      const message = JSON.parse(record.body);
      console.log(
        'SAVE USER/BOOKS QUEUE ==>',
        JSON.stringify(message, null, 2),
      );

      const tipo = message.tipoDeDados;
      if(tipo !== 'USUARIO' && tipo !== 'LIVRO'){
        console.error("Unkown messsage type: ",JSON.stringify(message, null, 2));
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Unknown message type',
            details: message,
          }),
        };
      }
      else if (tipo === 'USUARIO') {
        updatePromises.push(userService.updateUser(message));
      }
      else if(tipo === 'LIVRO') {
        updatePromises.push(bookService.updateBook(message));
      }
    }
    await Promise.all(updatePromises);
    return {
      statusCode: 200,
      body: JSON.stringify(records),
    };
  } catch (error) {
    console.log('FAIL');
    console.log(error.message);
    return {
      statusCode: error.code || 500,
      body: JSON.stringify({
        message: error.message || 'Internal Server Error',
      }),
    };
  }
};
