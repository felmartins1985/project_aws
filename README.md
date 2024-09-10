# Projeto de Aluguel de Livros

### Descrição
Este projeto implementa um sistema de aluguel de livros, onde os usuários podem alugar livros, sendo permitido apenas um volume por vez, respeitando a disponibilidade de exemplares. A aplicação utiliza vários serviços da AWS, como DynamoDB, Cognito, Lambda e SQS, e segue a arquitetura MVC (Model-View-Controller) com a programação orientada a objetos.

### Tecnologias e Ferramentas Utilizadas:

* Construído com Node.js, Express, Typescript, MongoDB e Zod
* Utilizando os princípios SOLID e Programação Orientada a Objetos
* Aplicando Arquitetura de Software, com as camadas de Modelo, Serviço e de Controladores
* Testes unitários com Jest
* AWS DynamoDB: Para armazenamento de registros de usuários e livros.
* AWS Cognito: Para registro, autenticação e autorização de usuários.
* AWS Lambda: Para execução de funções serverless.
* AWS SQS: Para garantir o processamento correto em situações de concorrência, como quando mais de um usuário tenta alugar o mesmo livro ao mesmo tempo.
* AWS CloudFormation: Para gerenciar a criação e manutenção dos recursos de infraestrutura AWS de forma declarativa.
* Serverless Framework: Utilizado para provisionar a infraestrutura via o arquivo serverless.yml.
* AWS SDK: Para realizar operações com os serviços da AWS por meio de código.
* AWS IAM:Para configurar as permissões dos serviços da AWS.

### Funcionalidades:
* Gerenciamento de Usuários: Os usuários podem se registrar, fazer login e autenticar suas ações utilizando tokens do Cognito.
* Sistema de Aluguel de Livros:
* Usuários podem alugar livros, com a restrição de apenas um volume por livro por vez.
* O sistema verifica a disponibilidade de volumes no estoque antes de permitir o aluguel.
* Fila de Processamento (SQS): Caso dois ou mais usuários tentem alugar o mesmo livro, a SQS entra em ação para garantir que o processo seja gerido de forma correta, evitando conflitos.

### Estrutura do Projeto
Este projeto segue o padrão MVC (Model-View-Controller), com a divisão de responsabilidades entre as camadas:
* Model: Contém as classes e métodos responsáveis pela estrutura de dados (usuários, livros, etc.) e regras de negócio.
* Service: Interface com o usuário e saída de dados.
* Presentation: Lógica que intermedia as requisições e gerencia o fluxo entre a View e o Model.

### Configuração
* Node.js e npm instalados
* AWS CLI configurado com permissões adequadas
* Serverless Framework instalado
