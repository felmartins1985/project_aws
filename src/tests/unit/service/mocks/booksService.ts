import { AxiosRequestHeaders } from "axios";
import { typePK } from "src/04-infrastructure/item";

export const Book: { nome: string;  id: string; volumesDisponiveis: number; volumesAlugados: number; usuarioId: any[]; tipoDeDados: typePK; }[] = [
  {
    nome: "Livro Exemplo",
    id: "2986582a-d06e-4f12-9d32-9feef70a897f",
    volumesDisponiveis: 10,
    volumesAlugados: 2,
    usuarioId: [],
    tipoDeDados: "LIVRO" // Certifique-se de que este valor é do tipo typePK
  },
  {
    nome: "Livro Exemplo2",
    id: "2986582a-d06e-4f12-9d32-9feef70a897f",
    volumesDisponiveis: 10,
    volumesAlugados: 2,
    usuarioId: [],
    tipoDeDados: "LIVRO" // Certifique-se de que este valor é do tipo typePK
  }
];

export const mockNoBook= {
  Count: 0
}

export const mockWithBook = {
  Count: 1,
  Items: [
    {
      pk: '##BOOK:e6499a83-8c49-4efe-940e-c90201e78685',
      sk: '##NAME:Biblia',
      data: [Object]
    }
  ]
}

export const mockUpdateBook = {  
  pk: '##LIVRO:2986582a-d06e-4f12-9d32-9feef70a897f',
  sk: '##NOME:Biblia',
  data:  {
    nome: 'Biblia',
    autor: 'Jesus',
    id: '2986582a-d06e-4f12-9d32-9feef70a897f',
    volumesDisponiveis: 7,
    volumesAlugados: 0,
    usuarioId: [ 'sadasdsad' ],
    tipoDeDados: 'LIVRO'
  },
  tipoDeDados: 'LIVRO'
}
const MockresponseAtiva = {
  "numFound": 741,
  "start": 0,
  "numFoundExact": true,
  "docs": [{ 
    "author_name": [
    "J.R.R. Tolkien"]
    }
  ]
}
export const mockResponseBook = {
  status: 200,
  data: MockresponseAtiva,
  statusText: 'OK',
  headers: { 'Content-Type': 'application/json' },
  config: {
    url: '',
    method: 'get',
    headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders,
  },
};