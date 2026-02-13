27/01/2026

# Especificação Funcional: Módulo Comercial

Sistema: Gestão de Saúde Ocupacional (SaaS) Versão: 1.0

## 1. Visão Geral

Este módulo gerencia as empresas contratantes (Clientes) e as regras de negócio financeiras e técnicas. É onde se define "quem paga a conta", "quanto custa cada exame para aquele cliente" e "quais exames cada cargo exige".

Objetivo: Garantir que, ao lançar um exame no módulo operacional, o sistema já saiba automaticamente o valor a ser cobrado e a validade do documento, sem depender da memória do operador.

## Atores Envolvidos:

- Administrador: Tem permissão total (criar clientes, alterar preços).
- Operador: Geralmente tem permissão apenas de visualização para consultar contratos, mas não altera preços.

## 2. Histórias de Usuário (User Stories)

### US-01: Cadastro de Cliente (Empresa)

Como Administrador, Quero cadastrar uma nova empresa cliente com seus dados fiscais e Grau de Risco, Para que eu possa começar a registrar os funcionários dela e emitir faturas mensais.

### US-02: Gestão de Preços Personalizados (Tabela de Exceção)

Como Administrador, Quero definir preços específicos de exames para um cliente (diferentes do preço de balcão), Para que o sistema respeite os acordos comerciais feitos em contrato (ex: A empresa X paga R$ 30,00 na Audiometria, enquanto o padrão é R$ 50,00).

### US-03: Definição de Cargos e Riscos (PCMSO)

Como Administrador/Técnico, Quero cadastrar os cargos do meu cliente e vincular quais exames são necessários para cada um, Para que o operador na recepção saiba exatamente quais exames lançar quando um funcionário daquele cargo chegar.

## 3. Requisitos Funcionais (Regras de Sistema)

### 3.1. Gestão de Clientes

ID Descrição do Requisito
Regra de Negócio (RN) associada

RF-010 O cadastro de cliente exige CNPJ único no sistema.
RN-10: Prevenção de duplicidade de cadastro.

RF-011 O campo "Grau de Risco" (1 a 4) é obrigatório.
RN-11: Base para cálculo da data de validade dos exames periódicos (NR-7).

RF-012 O sistema deve permitir anexar um arquivo PDF (Contrato Digital).
RN-12: Armazenamento opcional para consulta rápida dos termos.

## 3.2. Gestão de Preços e Protocolos

ID Descrição do Requisito
Regra de Negócio (RN) associada

RF-013 O sistema deve ter uma "Tabela Padrão" de procedimentos.
RN-13: Se o cliente não tiver preço negociado, usa-se este valor base.

RF-014 Ao criar um preço personalizado, ele tem prioridade sobre o padrão.
RN-14: Hierarquia: Preço Cliente &gt; Preço Padrão.

RF-015 O sistema deve permitir copiar protocolos de um cliente para outro.
RN-15: Agilidade (ex: Clonar cargos de uma Padaria para outra Padaria).

## 4. Fluxogramas de Processo

### Fluxo A: Cadastro de Novo Cliente e Regras

Este fluxo mostra o "Setup" de um novo contrato.

```
graph TD
A[Início: Novo Cliente] --&gt; B[Preencher Dados Fiscais e Risco]
B --&gt; C[Salvar Cliente]
C --&gt; D(Tem tabela especial?)
D --&gt; Não --&gt; E[Usar Tabela Padrão]
D --&gt; Sim --&gt; F[Selecionar Exames]
F --&gt; G[Definir Preço Acordado para cada item]
G --&gt; E
E --&gt; H[Cadastrar Cargos do Cliente]
H --&gt; I[Definir Protocolos (Exames p/ cada Cargo)]
I --&gt; J[Fim: Cliente Ativo]
```

### Fluxo B: Lógica de Precificação (Backend)

Como o sistema decide o preço na hora de faturar (invisível ao usuário).

```
graph LR
A[Solicitação de Exame] --&gt; B{Existe Preço no Cliente?}
B --&gt; Sim --&gt; C[Usar Preço Personalizado]
```

B -- Não --&gt; D[Usar Preço Base (Padrão)]
C --&gt; E[Gravar Snapshot no Item]
D --&gt; E

# 5. Definição de Interface (Campos de Tela)

## Tela 1: Lista de Clientes (Visão Geral)
Tabela com busca e filtros.

### Colunas:
1. Razão Social / Fantasia
2. CNPJ
3. Grau de Risco (Badge colorido: 1/2 Verde, 3/4 Laranja/Vermelho)
4. Status (Ativo/Inativo)
5. Ações (Ver Detalhes, Editar, Preços)

## Tela 2: Detalhe do Cliente (Abas)

### Aba 1: Dados Cadastrais
- Formulário com dados fiscais, endereço e contato financeiro (semelhante ao módulo administrativo).
- Campo destaque: Grau de Risco (Select 1-4).

### Aba 2: Cargos e Protocolos (A Matriz)
- Botão: "+ Novo Cargo"
- Lista Acordeão:
- Cargo: Motorista (Clique para expandir)
- Lista de Exames Exigidos:
- Admissional: Audiometria, Acuidade Visual, Clínico.
- Periódico: Audiometria, Clínico.
- Botão: "Editar Protocolo"

### Aba 3: Tabela de Preços (Exceções)
- Texto explicativo: "Os exames abaixo têm preços diferentes da tabela padrão para este cliente."
- Tabela Editável:
- Coluna: Procedimento (Select com busca).
- Coluna: Preço Padrão (Read-only, para referência).
- Coluna: Preço Acordado (Input numérico).
- Botão: "+ Adicionar Exceção de Preço"

## 6. Modelo de Dados (Referência Rápida)

Para suporte ao desenvolvimento, as tabelas principais afetadas aqui são:

- clients (Dados e Risco)
- job_roles (Cargos vinculados ao client_id)
- client_price_list (A exceção de preço)
- exam_protocols (A regra Cargo x Procedimento)
