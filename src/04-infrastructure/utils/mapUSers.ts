import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import { UserMap } from 'src/03-model/interface/usermap';

export const mapUsers = (userList: UserType[]): Array<UserMap> => {
    const mapedUsers = userList.map(user => {
      const findName = user.Attributes.find(attr => attr.Name === 'name');
      const findrole = user.Attributes.find(attr => attr.Name === 'custom:role');  
      const findId = user.Attributes.find(attr => attr.Name === 'sub');
  
      const { Value: name } = findName ?? { Value: user.Username };
      const { Value: id } = findId ?? { Value: null };
      const { Value: role } = findrole ?? { Value: null };
      return {
        id,
        name,
        email: user.Username,
        role,
      };
    });
    return mapedUsers;
  };