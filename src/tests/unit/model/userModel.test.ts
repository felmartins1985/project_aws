import { typePK } from 'src/04-infrastructure/item';
import { UserItem } from 'src/04-infrastructure/items/user-item';
import { BookDefinition } from 'src/03-model/bookdefinition';
import { UserDefinition, UserType} from 'src/03-model/userdefinition'
describe('UserDefinition', () => {
  const mockUsuario = {
    documento: '12345678910',
    id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
    tipo: 'PF' as UserType,
    nome: 'Felipe',
    dataDeInicioOuNascimento: '1990-06-17',
    enderecos: ['Rua dos Bobos, 0'],
    telefones: [12345678],
    livroId: [],
    tipoDeDados: 'USUARIO' as typePK, 
  };
  const mockLivro = {
    id: "ae5e855f-0fa1-4358-a425-8c6812cef204",
    nome: "book",
    autor: "Jesus",
    volumesDisponiveis: 1,
    volumesAlugados: 0, 
    usuarioId: [],
    tipoDeDados: "LIVRO" as typePK,
    validate(): void{},
    addLivro(): void{},
    removeLivro(): void{}
  };
  it('should create a instance correctly', () => {
    const userInstance = UserDefinition.manufacture(mockUsuario);
    expect(userInstance).toBeInstanceOf(UserDefinition);
    expect(userInstance.documento).toEqual(mockUsuario.documento);
    expect(userInstance.id).toEqual(mockUsuario.id);
    expect(userInstance.tipo).toEqual(mockUsuario.tipo);
    expect(userInstance.nome).toEqual(mockUsuario.nome);
    expect(userInstance.dataDeInicioOuNascimento).toEqual(mockUsuario.dataDeInicioOuNascimento);
    expect(userInstance.enderecos).toEqual(mockUsuario.enderecos);
    expect(userInstance.telefones).toEqual(mockUsuario.telefones);
    expect(userInstance.livroId).toEqual(mockUsuario.livroId);
  });
  it('should throw an error - documento', async ()=>{
    const invalidUser = {
      documento: '123456789111',
      id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
      tipo: 'PF' as UserType,
      nome: 'Felipe',
      dataDeInicioOuNascimento: '1990-06-17',
      enderecos: ['Rua dos Bobos, 0'],
      telefones: [12345678],
      livroId: [],
      tipoDeDados: 'USUARIO' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("Documento invalido");
  });
  it('should throw an error - id', async ()=>{
    const invalidUser = {
      documento: '12345678911',
      id: '11111',
      tipo: 'PF' as UserType,
      nome: 'Felipe',
      dataDeInicioOuNascimento: '1990-06-17',
      enderecos: ['Rua dos Bobos, 0'],
      telefones: [12345678],
      livroId: [],
      tipoDeDados: 'USUARIO' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("Invalido UUID no id");
  });
  it('should throw an error - nome', async ()=>{
    const invalidUser = {
      documento: '123456789111',
      id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
      tipo: 'PF' as UserType,
      nome: 'Fe',
      dataDeInicioOuNascimento: '1990-06-17',
      enderecos: ['Rua dos Bobos, 0'],
      telefones: [12345678],
      livroId: [],
      tipoDeDados: 'USUARIO' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("Nome invalido");
  });
  it('should throw an error - dataDeInicioOuNascimento', async ()=>{
    const invalidUser = {
      documento: '123456789111',
      id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
      tipo: 'PF' as UserType,
      nome: 'Felipe',
      dataDeInicioOuNascimento: '',
      enderecos: ['Rua dos Bobos, 0'],
      telefones: [12345678],
      livroId: [],
      tipoDeDados: 'USUARIO' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("Data de nascimento invalido");
  });
  it('should throw an error - tipo', async ()=>{
    const invalidUser = {
      documento: '123456789111',
      id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
      tipo: 'PR' as UserType,
      nome: 'Felipe',
      dataDeInicioOuNascimento: '1985-06-17',
      enderecos: ['Rua dos Bobos, 0'],
      telefones: [12345678],
      livroId: [],
      tipoDeDados: 'USUARIO' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("tipo invalido");
  });
  it('should throw an error - tipoDeDados', async ()=>{
    const invalidUser = {
      documento: '123456789111',
      id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
      tipo: 'PF' as UserType,
      nome: 'Felipe',
      dataDeInicioOuNascimento: '1985-06-17',
      enderecos: ['Rua dos Bobos, 0'],
      telefones: [12345678],
      livroId: [],
      tipoDeDados: 'USU' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("Tipo de dados invalido");
  });
  it('should throw an error - enderecos', async ()=>{
    const invalidUser = {
      documento: '123456789111',
      id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
      tipo: 'PF' as UserType,
      nome: 'Felipe',
      dataDeInicioOuNascimento: '1985-06-17',
      enderecos: [""],
      telefones: [12345678],
      livroId: [],
      tipoDeDados: 'USUARIO' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("Endereços invalidos");
  });
  it('should throw an error - telefones', async ()=>{
    const invalidUser = {
      documento: '123456789111',
      id: 'ae5e855f-0fa1-4358-a425-8c6812cef202',
      tipo: 'PF' as UserType,
      nome: 'Felipe',
      dataDeInicioOuNascimento: '1985-06-17',
      enderecos: ["rua dos bobos, 0"],
      telefones: [12345],
      livroId: [],
      tipoDeDados: 'USUARIO' as typePK, 
    };
    expect(() => {
      UserDefinition.manufacture(invalidUser);
    }).toThrow("Telefones invalidos");
  });
  it('should add a book correctly', async ()=>{
    const livroInstancia = UserDefinition.manufacture(mockUsuario);
    livroInstancia.addLivro(mockLivro as unknown as BookDefinition);
    expect(livroInstancia.livroId).toEqual([mockLivro.id]);
  });
  it('should remove a book correctly', async ()=>{
    const livroInstancia = UserDefinition.manufacture(mockUsuario);
    livroInstancia.removeLivro(mockLivro as unknown as BookDefinition);
    expect(livroInstancia.livroId).toHaveLength(0);
  })
});