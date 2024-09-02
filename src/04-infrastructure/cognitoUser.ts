import { AdminCreateUserCommand, AdminDisableUserCommand, AdminEnableUserCommand, AdminInitiateAuthCommand, AdminSetUserPasswordCommand, AdminUpdateUserAttributesCommand, CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { BaseCognitoPool } from './interface/cognitoPoolInterface';
import { RegisterCognitoUser } from 'src/01-presentation/controllers/schemas/cognitoNewUser';
import { mapUsers } from './utils/mapUSers';

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_ACCOUNT_REGION ?? 'us-east-1',
});

export class CognitoPool implements BaseCognitoPool {
  private cognitoPoolClient = client;

  constructor(readonly userPoolId: string, readonly cognitoClientId: string) { }

  async registerUser(cognitoUser: RegisterCognitoUser): Promise<boolean> {
    
    // cria usuário com password temporario
    const response = await this.cognitoPoolClient.send(
      new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: cognitoUser.email, // para fazer o login
        TemporaryPassword: cognitoUser.password,
        UserAttributes: [
            {
                Name: 'name',
                Value: cognitoUser.nome,
              },
              {
                Name: 'email',
                Value: cognitoUser.email,
              },
              {
                Name: 'custom:role',
                Value: JSON.stringify(cognitoUser.role),
              },    
        ],
        MessageAction: 'SUPPRESS',
      }),
    );
    if (response.$metadata.httpStatusCode !== 200) {
      return false;
    }
  // seta password informado pelo usuário
    const setUserPasswordResponse = await this.cognitoPoolClient.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: cognitoUser.email,
        Password: cognitoUser.password,
        Permanent: true,
      }),
    );
  
    return setUserPasswordResponse.$metadata.httpStatusCode === 200;
  }

  public async findUserByEmail(email: string): Promise<any> {
    const command = new ListUsersCommand({
      UserPoolId: this.userPoolId,
      Filter: `email = "${email}"`,
    });

    const response = await this.cognitoPoolClient.send(command);
    if (response.Users && response.Users.length > 0) {
      const mapedUsers = mapUsers(response.Users)[0];
      return mapedUsers;
    }
    return {};
  }

  async authenticateUser(authParameters: {
    USERNAME: string;
    PASSWORD: string;
  }): Promise<string> {
      const command =  new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: authParameters,
      ClientId: this.cognitoClientId,
      UserPoolId: this.userPoolId,
    });
    const response = await this.cognitoPoolClient.send(command);
    return response.AuthenticationResult.AccessToken;
  }

}
