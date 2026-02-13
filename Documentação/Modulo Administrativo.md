27/01/2026, 14:00

# Especificação Funcional: Módulo Administrativo

Sistema: Gestão de Saúde Ocupacional (SaaS) Versão: 1.3

## 1. Visão Geral

Este módulo é responsável pela configuração inicial do ambiente (Tenant) e pela gestão de segurança. É o primeiro ponto de contato do cliente (Proprietário da Consultoria) com o software.

Contexto de Negócio: O sistema será utilizado por uma Consultoria de Saúde e Segurança do Trabalho. A consultoria gerencia os exames, encaminha funcionários para clínicas parceiras (terceirizadas), mas centraliza a gestão e o faturamento para o cliente final.

Escopo: O sistema tem foco administrativo/financeiro. Ele registra os exames realizados externamente para fins de controle e faturamento consolidado.

## Atores Envolvidos:

- Administrador (ADMIN): Tem acesso total. Pode alterar dados da consultoria e gerenciar outros usuários. O primeiro usuário a se cadastrar torna-se automaticamente o Administrador e dono da Organização.
- Operador: Tem acesso apenas visualização e operação (lançamento de guias/exames), sem permissão de edição de dados da empresa.

## 2. Histórias de Usuário (User Stories)

### US-01: Configuração da Consultoria

Como Administrador, Quero cadastrar os dados fiscais, endereço, logo e responsável técnico da minha consultoria, Para que esses dados apareçam automaticamente no cabeçalho das Faturas e Relatórios Financeiros gerados para meus clientes (empresas).

### US-02: Gestão de Equipe

Como Administrador, Quero convidar/cadastrar novos usuários e definir seus níveis de acesso (Admin ou Operador), Para que meus funcionários possam utilizar o sistema com as permissões adequadas.

### US-03: Bloqueio de Acesso

Como Administrador, Quero inativar o acesso de um funcionário que foi desligado, Para que ele não consiga mais visualizar dados sensíveis da consultoria, mas o histórico do que ele fez permaneça salvo.


# 3. Requisitos Funcionais (Regras de Sistema)

## 3.1. Gerenciamento da Organização (Tenant)

ID Descrição do Requisito
Regra de Negócio (RN) associada

RF-001 O sistema deve permitir upload de imagem para o Logo.
RN-01: Formatos: PNG/JPG. Tam. Máx: 2MB. Usado em Faturas/Guias.

RF-002 O sistema deve validar o formato do CNPJ.
RN-02: Algoritmo de validação padrão Brasil (14 dígitos).

RF-003 O campo "Responsável Técnico" é obrigatório.
RN-03: Identificação do médico coordenador ou engenheiro responsável pela Consultoria.

RF-004 O sistema deve permitir apenas UM cadastro de organização por ambiente.
RN-04: Single Tenant lógico (Uma consultoria por assinatura).

## 3.2. Gerenciamento de Usuários

ID Descrição do Requisito
Regra de Negócio (RN) associada

RF-005 O cadastro de usuário deve ser vinculado ao Supabase Auth.
RN-05: O login é gerido pelo provedor de identidade.

RF-006 Não é permitido excluir usuários fisicamente do banco.
RN-06: Deve-se usar "Soft Delete" (Status = Inativo) para manter integridade dos logs.

RF-007 O sistema deve impedir que um usuário inative a si mesmo.
RN-07: Prevenção de "Lockout" (trancar-se fora).

RF-008 Apenas usuários com role 'ADMIN' podem criar outros usuários.
RN-08: Segurança hierárquica.

# 4. Fluxogramas de Processo

## Fluxo de Cadastro (Onboarding)
O sistema possui duas portas de entrada distintas baseadas no papel (role) do usuário:

1. **Dono da Consultoria (Admin / Tenant Owner):**
   * Realiza cadastro na rota pública.
   * Nasce sem vínculo corporativo (`organization_id = null`).
   * É forçado a preencher os dados da Consultoria (US-01) no primeiro login antes de acessar o dashboard.

2. **Funcionários (Operadores):**
   * Não podem se cadastrar livremente.
   * Recebem um link único de convite gerado pelo Admin.
   * Ao aceitarem o convite, o perfil é criado já com o `role` definido e vinculado automaticamente ao `organization_id` da consultoria que os convidou.

## Fluxo A: Cadastro Inicial (Sign Up) e Onboarding


Este fluxo define a ordem de criação: Primeiro Usuário, depois a Consultoria.

```txt
graph TD
A[Visitante acessa Tela de Login] --&gt; B[Cria conta (E-mail/Senha)]
B --&gt; C[Sistema cria Auth User + Perfil Vazio]
C --&gt; D{O Perfil tem Organização?}
D -- Sim --&gt; E[Redirecionar para Dashboard]
D -- Não --&gt; F[Exibir Tela: 'Bem-vindo! Cadastre sua Consultoria']
F --&gt; G[Preencher: Razão Social, CNPJ, Endereço]
G --&gt; H[Salvar Dados da Organização]
H --&gt; I[Sistema vincula Perfil à nova Organização]
I --&gt; J[Sistema define Perfil como ADMIN]
```


## Fluxo B: Cadastro de Novo Usuário da Equipe (Convite)

graph LR
A[Dashboard] --&gt; B[Menu: Configurações]
B --&gt; C[Aba: Usuários]
C --&gt; D[Botão: + Novo Usuário]
D --&gt; E[Formulário: E-mail, Nome, Cargo]
E --&gt; F[Sistema Cria Auth no Supabase]
F --&gt; G[Sistema Cria Perfil vinculado à Org do Admin]
G --&gt; H[Usuário recebe E-mail de Convite]

## 5. Definição de Interface (Campos de Tela)

### Tela 1: Minha Consultoria (Configurações)

Esta tela deve ser um formulário longo dividido em 3 seções (Cards).

### Seção 1: Identidade Corporativa

- UploaddeImagem

(Preview circular - Logo para documentos)

- Campo: Nome Fantasia (Obrigatório)
- Campo: Razão Social (Obrigatório)
- Campo: CNPJ (Máscara: 00.000.000/0000-00)

### Seção 2: Responsabilidade Técnica (PCMSO)

- Campo: Nome do Médico/Engenheiro Coordenador
- Campo: Registro Profissional (CRM/CREA) / UF

### Seção 3: Endereço e Contato

- Campo: CEP (Busca automática via API ViaCEP recomendada)
- Campo: Logradouro, Número, Bairro, Cidade, UF.
- Campo: Telefone
- Campo: E-mail Oficial / Financeiro

### Tela 2: Gestão de Usuários (Lista)

Tabela exibindo a equipe interna da consultoria.

## Colunas da Tabela:

1. Nome (Avatar + Nome Completo)


2. E-mail
3. Permissão (Badge: ADMIN azul / OPERADOR cinza)
4. Status (Badge: ATIVO verde / INATIVO vermelho)
5. Ações (Botão Editar, Botão Inativar)

## Modal: Novo Usuário

- Campo: Nome Completo
- Campo: E-mail (Será o login)
- Campo: Permissão (Select: Administrador, Operador)
- Botão: "Salvar e Convidar"
