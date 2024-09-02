import { typePK } from "src/04-infrastructure/item";
import { UserType } from "src/03-model/userdefinition";

export const Users: { id: string; documento: string; tipo: UserType; nome: string,dataDeInicioOuNascimento: string; enderecos: string[]; telefones: number[],livroId: any[]; tipoDeDados: typePK; }[] = [
  {
    id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
    documento: '12345678910',
    tipo: 'PF',
    nome: 'Felipe',
    dataDeInicioOuNascimento: '1985-06-17',
    enderecos: ['rua saturno 9'],
    telefones: [12345678],
    livroId: ["a27243ce-6835-44f6-b6b4-353f8a7419f1"],
    tipoDeDados: "USUARIO"
  }
];

export const mockWithUser = {
  Count: 1,
  Items: [
    {
      "pk": "##USER:ae5e855f-0fa1-4358-a425-8c6812cef204",
      "sk": "##DOCUMENT:12345678910",
      data: {
        id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
        documento: '12345678910',
        tipo: 'PF',
        nome: 'Felipe',
        dataDeInicioOuNascimento: '1985-06-17',
        enderecos: ['rua saturno 9'],
        telefones: [12345678],
        livroId: [],
        tipoDeDados: "USUARIO"
      },
      "tipoDeDados": "USUARIO"
    }
  ]
}


export const mockWithUserUpdateWithNoBookId = {
  "pk": "##USER:ae5e855f-0fa1-4358-a425-8c6812cef204",
  "sk": "##DOCUMENT:12345678910",
  data: {
    id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
    documento: '12345678910',
    tipo: 'PF',
    nome: 'Felipe',
    dataDeInicioOuNascimento: '1985-06-17',
    enderecos: ['rua saturno 9'],
    telefones: [12345678],
    livroId: [],
    tipoDeDados: "USUARIO"
  },
  "tipoDeDados": "USUARIO"
}
export const mockWithUserUpdateWithBookId = {
"pk": "##USER:ae5e855f-0fa1-4358-a425-8c6812cef204",
"sk": "##DOCUMENT:12345678910",
data: {
  id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
  documento: '12345678910',
  tipo: 'PF',
  nome: 'Felipe',
  dataDeInicioOuNascimento: '1985-06-17',
  enderecos: ['rua saturno 9'],
  telefones: [12345678],
  livroId: ["a27243ce-6835-44f6-b6b4-353f8a7419f1"],
  tipoDeDados: "USUARIO"
},
"tipoDeDados": "USUARIO"
}
export const mockNoUser= {
Count: 0
}
export const mockUpdateBook = {
"pk": "##BOOK:a27243ce-6835-44f6-b6b4-353f8a7419f1",
"sk": "##NAME:Biblia",
"data": {
  "nome": "Biblia",
  "id": "a27243ce-6835-44f6-b6b4-353f8a7419f1",
  "volumesDisponiveis": 1,
  "volumesAlugados": 0,
  "usuarioId": [],
  "autor": "Jesus",
  "tipoDeDados": "LIVRO"
},
"tipoDeDados": "LIVRO"
}
export const mockUpdateBookWithStatusWithNoUserId = {
status: true,
"data":{
  "pk": "##BOOK:a27243ce-6835-44f6-b6b4-353f8a7419f1",
  "sk": "##NAME:Biblia",
  "data": {
    "nome": "Biblia",
    "id": "a27243ce-6835-44f6-b6b4-353f8a7419f1",
    "volumesDisponiveis": 1,
    "volumesAlugados": 0,
    "usuarioId": [],
    "autor": "Jesus",
    "tipoDeDados": "LIVRO"
  },
  "tipoDeDados": "LIVRO"
}
}
export const mockUpdateBookWithStatusWithUserId = {
status: true,
"data":{
  "pk": "##BOOK:a27243ce-6835-44f6-b6b4-353f8a7419f1",
  "sk": "##NAME:Biblia",
  "data": {
    "nome": "Biblia",
    "id": "a27243ce-6835-44f6-b6b4-353f8a7419f1",
    "volumesDisponiveis": 0,
    "volumesAlugados": 1,
    "usuarioId": ['ae5e855f-0fa1-4358-a425-8c6812cef204'],
    "autor": "Jesus",
    "tipoDeDados": "LIVRO"
  },
  "tipoDeDados": "LIVRO"
}
}
export const mockBookNoAvailable = {
status: true,
"data":{
  "pk": "##BOOK:a27243ce-6835-44f6-b6b4-353f8a7419f1",
  "sk": "##NAME:Biblia",
  "data": {
    "nome": "Biblia",
    "id": "a27243ce-6835-44f6-b6b4-353f8a7419f1",
    "volumesDisponiveis": 0,
    "volumesAlugados": 1,
    "usuarioId": [],
    "autor": "Jesus",
    "tipoDeDados": "LIVRO"
  },
  "tipoDeDados": "LIVRO"
}
}