import {BookDefinition} from 'src/03-model/bookdefinition';
import {Item, typePK} from '../item';

export const PK_PREFIX = '##LIVRO';
export const SK_PREFIX = '##NOME';

export class BookItem extends Item<BookDefinition> {
  static Pk(id: string){
    return `${PK_PREFIX}:${id}`;
  }
  static Sk(livro: string){
    return `${SK_PREFIX}:${livro}`;
  }
  static type(type: typePK){
    return type;
  }
  static From(definition: BookDefinition): BookItem{
    const pk= BookItem.Pk(definition.id);
    const sk = BookItem.Sk(definition.nome);
    const tipoDeDados = BookItem.type(definition.tipoDeDados);
    return {
      pk,
      sk,
      data: definition,
      tipoDeDados
    }
  }
}