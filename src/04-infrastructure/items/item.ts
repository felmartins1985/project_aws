export type typePK = 'USUARIO' | 'LIVRO'
export abstract class Item<T> {
  pk: string;
  sk: string;
  data: T;
  tipoDeDados: typePK
}

