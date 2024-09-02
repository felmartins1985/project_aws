import { UserDefinition } from "src/03-model/userdefinition";
import { Item, typePK} from '../item';

export const PK_PREFIX = '##USUARIO';
export const SK_PREFIX = '##DOCUMENTO';


export class UserItem extends Item<UserDefinition>{
  static Pk(id: string){
    return `${PK_PREFIX}:${id}`;
  }
  static Sk(documento: string){
    return `${SK_PREFIX}:${documento}`;
  }
  static tipo(type: typePK){
    return type;
  }
  static From(definition: UserDefinition): UserItem{
    const pk= UserItem.Pk(definition.id);
    const sk = UserItem.Sk(definition.documento);
    const tipoDeDados = UserItem.tipo(definition.tipoDeDados);
    return {
      pk,
      sk,
      tipoDeDados,
      data: definition,
    }
  }
}