import { bookSchema} from './schemas/bookSchema'
import {bookUpdateSchema} from './schemas/bookUpdateSchema'
import {BookItem} from 'src/04-infrastructure/items/book-item'
import { BookDefinition } from 'src/03-model/bookdefinition';
import { BookService } from 'src/02-services/book.service';
import { Request, Response } from 'express';
import {Book} from 'src/03-model/interface/bookType';
import { DynamoTable } from 'src/04-infrastructure/dynamodb.table';
import { BookServiceInterface } from 'src/02-services/interface/bookServiceInterface';
export class BookController{
  public bookService: BookServiceInterface;
  public dynamoTable: DynamoTable;
  constructor(dynamoTable: DynamoTable, bookService: BookServiceInterface){
    this.dynamoTable = dynamoTable;
    this.bookService = bookService;
  }
  async createBook (req: Request, res: Response)  {
    try{
      const validate = bookSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      req.body.nome = req.body.nome.toLowerCase();
      const result = await this.bookService.createBook(req.body);
      if(result.error){
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    }catch(error){
      console.log("=====> ERROR NO CATCH DO CREATE", error)
      return res.status(400).json(error.message);
    }
  }
  async getById (req: Request, res: Response) {
    try{
      const { id } = req.params;
      if(!id){
        return res.status(400).json({status: true, error: 'Id é necessário'})
      }
      const livro = await this.bookService.getById(id);
      if(livro.error){
        return res.status(404).json(livro);
      }
      return res.status(200).json(livro);
    }catch(error){
      console.log("============> ERROR NO CATCH DO GET", error)
      return res.status(500).json(error.message);
    }
  }
  async updateBook(req: Request, res: Response){
    try{
      const {id, nome} = req.params;
      if(!id || !nome){
        return res.status(400).json({status: true, error: 'Id e nome sao obrigatorios'})
      }
      const livroAchado= await this.bookService.getById(id);
      if(livroAchado.error){
        return res.status(404).json(livroAchado)
      }
      const validate = bookUpdateSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const { autor, tipoDeDados, id: idLivro } = livroAchado.data.data;
      const novoObjeto = {
        autor,
        nome,
        id : idLivro,
        tipoDeDados,
        ...validate.data
      }
      const bookUpdate = BookDefinition.manufacture(novoObjeto as Book);
      const bookItem = BookItem.From(bookUpdate);
      const result = await this.bookService.updateBook(bookItem);
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO CATCH DO UPDATE", error)
      return res.status(500).json(error.message);
    }
  }
  async getByName(req: Request, res: Response) {
    try{
      const { nome } = req.params;
      if(!nome){
        return res.status(400).json({status: true, error: 'nome é obrigatorio'})
      }
      
      const book = await this.bookService.getByName(nome.toLowerCase());
      if(book.error){
        return res.status(404).json(book)
      }
      return res.status(200).json(book);
    }catch(error){
      console.log("============> ERROR NO CATCH DO GET BY NAME", error)
      return res.status(500).json(error.message);
    }
  }
}