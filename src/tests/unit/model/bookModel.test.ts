import {BookDefinition} from 'src/03-model/bookdefinition';
import { typePK } from 'src/04-infrastructure/item';
import { UserDefinition, UserType } from 'src/03-model/userdefinition';
describe('BookDefinition', () => {
  const mockLivro = {
    id: "ae5e855f-0fa1-4358-a425-8c6812cef204",
    nome: "book",
    autor: "Jesus",
    volumesDisponiveis: 1,
    volumesAlugados: 0, 
    usuarioId: [],
    tipoDeDados: "LIVRO" as typePK
  };
  const mockUser = {
    id: "ae5e855f-0fa1-4358-a425-8c6812cef202",
    documento: "12345678910",
    tipo: "PF" as UserType,
    nome: "Felipe",
    dataDeInicioOuNascimento: "1985-06-17",
    enderecos: ["rua saturno 9"],
    telefones: [12345678],
    livroId: [],
    tipoDeDados: "USUARIO" as typePK,
    validate(): void{},
    addLivro(): void{},
    removeLivro(): void{}
  }
  it('should create a instance correctly', () => {
    const bookInstance = BookDefinition.manufacture(mockLivro);
    expect(bookInstance).toBeInstanceOf(BookDefinition);

    expect(bookInstance.tipoDeDados).toEqual(mockLivro.tipoDeDados);
    expect(bookInstance.id).toEqual(mockLivro.id);
    expect(bookInstance.nome).toEqual(mockLivro.nome);
    expect(bookInstance.autor).toEqual(mockLivro.autor);
    expect(bookInstance.volumesDisponiveis).toEqual(mockLivro.volumesDisponiveis);
    expect(bookInstance.volumesAlugados).toEqual(mockLivro.volumesAlugados);
    expect(bookInstance.usuarioId).toEqual(mockLivro.usuarioId);
  });
  it('should throw an error - volumesDisponiveis', async ()=>{
    const invalidLivro = {
      id: "ae5e855f-0fa1-4358-a425-8c6812cef204",
      nome: "book",
      autor: "Jesus",
      volumesDisponiveis: -1, // Valor inválido
      volumesAlugados: 0,
      usuarioId: [],
      tipoDeDados: "LIVRO" as typePK
    };

    expect(() => {
      BookDefinition.manufacture(invalidLivro);
    }).toThrow("Volumes disponiveis invalido");
  });
  it('should throw an error - nome', async ()=>{
    const invalidLivro = {
      id: "ae5e855f-0fa1-4358-a425-8c6812cef204",
      nome: "bo",
      autor: "Jesus",
      volumesDisponiveis: -1, // Valor inválido
      volumesAlugados: 0,
      usuarioId: [],
      tipoDeDados: "LIVRO" as typePK
    };
    expect(() => {
      BookDefinition.manufacture(invalidLivro);
    }).toThrow("Nome invalido");
  });
  it('should throw an error - volumesAlugados', async ()=>{
    const invalidLivroVD = {
      id: "ae5e855f-0fa1-4358-a425-8c6812cef204",
      nome: "book",
      autor: "Jesus",
      volumesDisponiveis: 0,
      volumesAlugados: -1,
      usuarioId: [],
      tipoDeDados: "LIVRO" as typePK
    };
    expect(() => {
      BookDefinition.manufacture(invalidLivroVD);
    }).toThrow("Volumes alugados invalido");
  });
  it('shoul throw an error - id', async ()=>{
    const invalidLivroVD = {
      id: "2222",
      nome: "book",
      autor: "Jesus",
      volumesDisponiveis: 0,
      volumesAlugados: 0,
      usuarioId: [],
      tipoDeDados: "LIVRO" as typePK
    };
    expect(() => {
      BookDefinition.manufacture(invalidLivroVD);
    }).toThrow("Invalido UUID no id");
  });
  it('should throw an error - autor', async ()=>{
    const invalidLivroVD = {
      id: "ae5e855f-0fa1-4358-a425-8c6812cef204",
      nome: "book",
      autor: "je",
      volumesDisponiveis: 0,
      volumesAlugados: -1,
      usuarioId: [],
      tipoDeDados: "LIVRO" as typePK
    };
    expect(() => {
      BookDefinition.manufacture(invalidLivroVD);
    }).toThrow("Autor invalido");
  });
  it('should throw an error - tipoDeDados', async ()=>{
    const invalidLivroVD = {
      id: "ae5e855f-0fa1-4358-a425-8c6812cef204",
      nome: "book",
      autor: "jesus",
      volumesDisponiveis: 0,
      volumesAlugados: -1,
      usuarioId: [],
      tipoDeDados: "Ola" as typePK
    };
    expect(() => {
      BookDefinition.manufacture(invalidLivroVD);
    }).toThrow("Tipo de dados invalido");
  });
  it('should add a user correctly', async ()=>{
    const bookInstance = BookDefinition.manufacture(mockLivro);
    bookInstance.addUsuario(mockUser as unknown as UserDefinition);
    expect(bookInstance.usuarioId).toEqual([mockUser.id]);
  });
  it('should remove a user correctly', async ()=>{
    const bookInstance = BookDefinition.manufacture(mockLivro);
    bookInstance.removeUsuario(mockUser as unknown as UserDefinition);
    expect(bookInstance.usuarioId).toHaveLength(0);
  })

});