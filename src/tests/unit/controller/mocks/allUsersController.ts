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
        enderecos: ['rua jupiter 19'],
        telefones: [12345678],
        livroId: [],
        tipoDeDados: "USUARIO"
      },
      tipoDeDados: "USUARIO"
    }
  ]
}

export const mockWithUserStatus = {
    "status": true,
    "data": {
      "pk": "##USER:ae5e855f-0fa1-4358-a425-8c6812cef204",
      "sk": "##DOCUMENT:12345678910",
      "data": {
        "tipo": "PF",
        "enderecos": [
          "rua jupiter 19"
        ],
        "dataDeInicioOuNascimento": "1985-06-17",
        "documento": "12345678910",
        "nome": "Felipe",
        "id": "ae5e855f-0fa1-4358-a425-8c6812cef204",
        "telefones": [
          12345678
        ],
        "livroId": [],
        "tipoDeDados": "USUARIO"
      },
      "tipoDeDados": "USUARIO"
    }
}