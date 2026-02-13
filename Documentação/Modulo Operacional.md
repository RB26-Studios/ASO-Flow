27/01/2026

# Especificação Funcional: Módulo Operacional

Sistema: Gestão de Saúde Ocupacional (SaaS) Versão: 1.1

## 1. Visão Geral

Este módulo cuida do dia a dia da operação: cadastro de funcionários (pacientes) e registro de atendimentos (exames realizados).

**Objetivo Principal:** Garantir o registro rápido e correto dos exames para fins de faturamento e histórico, minimizando o erro humano na escolha de preços ou procedimentos.

**Atores Envolvidos:**

- Operador (Recepção/Atendimento): Cadastra pessoas e lança os exames.
- Administrador: Pode editar registros lançados errados (estorno/correção).

## 2. Histórias de Usuário (User Stories)

### US-04: Cadastro de Funcionário (Paciente)

Como Operador, Quero cadastrar os dados pessoais de um funcionário vinculado a um Cliente e seu respectivo Cargo, Para que eu mantenha um histórico único dessa pessoa e o sistema saiba quais riscos ele está exposto.

### US-05: Registro de Atendimento (Lançamento de Guia)

Como Operador, Quero registrar que um funcionário realizou um exame (ex: Admissional) e o sistema deve carregar automaticamente os itens obrigatórios do cargo atual dele, Para que eu não esqueça de cobrar nenhum exame e o valor seja calculado automaticamente conforme o contrato.

### US-06: Consulta de Histórico

Como Operador/Consultor, Quero ver a lista de todos os exames que um funcionário já fez, Para que eu possa verificar a vigência do último ASO antes de agendar um novo.

## 3. Requisitos Funcionais (Regras de Sistema)

### 3.1. Gestão de Pessoas

|  ID | Descrição do Requisito | Regra de Negócio (RN) associada  |
| --- | --- | --- |
|  RF-020 | O sistema deve validar o CPF do funcionário. | RN-20: CPF deve ser único dentro do sistema para evitar duplicidade de prontuário.  |

RF- O cadastro deve exigir Data de 021 Nascimento.
RN-21: Essencial para calcular a validade do ASO (exames periódicos variam conforme a idade e risco).

RF- O funcionário deve estar 021b vinculado a um Cargo (Job Role) vigente.
RN-21b: Esse vínculo permite o carregamento automático dos exames (Protocolo) na hora do atendimento.

# 3.2. Execução do Atendimento (O "Carrinho" de Exames)

|  ID | Descrição do Requisito | Regra de Negócio (RN) associada  |
| --- | --- | --- |
|  RF- 022 | Ao selecionar o Funcionário + Tipo de Exame, o sistema deve ler o Cargo do funcionário e auto-popular a lista de procedimentos. | RN-22 (Automação): Busca na tabela exam_protocols definida no Módulo Comercial baseada no Cargo vinculado ao funcionário.  |
|  RF- 023 | O sistema deve buscar o preço na seguinte ordem: Preço Cliente > Preço Padrão. | RN-23 (Hierarquia): Garante a cobrança correta acordada em contrato.  |
|  RF- 024 | CRÍTICO: Ao salvar o atendimento, o sistema deve gravar o preço cobrado no item (price_charged). | RN-24 (Snapshot): O valor histórico não pode mudar mesmo que a tabela de preços seja alterada no futuro.  |
|  RF- 025 | O sistema deve calcular a Data de Validade do ASO automaticamente. | RN-25 (Cálculo NR-7):  |

- Risco 1/2: Validade 1 ano (ou 2 anos se &lt; 45 anos/menor risco).
- Risco 3/4: Validade 1 ano.

# 4. Fluxogramas de Processo

## Fluxo A: Novo Atendimento (A "Jornada do Operador")

Este é o processo mais repetido do sistema. Deve ser fluido e com poucos cliques.

```txt
graph TD
A[Início: Nova Guia/Atendimento] --&gt; B[Buscar Funcionário por CPF]
B --&gt; C{Encontrou?}
C -- Não --&gt; D[Tela: Cadastrar Novo Funcionário]
D --&gt; D1[Preencher Dados Pessoais]
D --&gt; D2[Vincular ao Cargo do Cliente]
D2 --&gt; E[Salvar Funcionário]
C -- Sim --&gt; E[Selecionar Funcionário]
E --&gt; F[Selecionar Dados do Atendimento]
F --&gt; F1[Qual Cliente? (Auto)]
F --&gt; F2[Qual Cargo? (Auto)]
F --&gt; F3[Qual Tipo? (Admissional...)]
```

F3 --&gt; G[SISTEMA: Carrega Itens do Protocolo do Cargo]
G --&gt; H[Tela exibe: Lista de Exames Sugeridos + Preços Calculados]

H --&gt; I{Precisa adicionar extra?}
I -- Sim --&gt; J[Adicionar Procedimento Manual]
I -- Não --&gt; K[Conferir Valores]

K --&gt; L[Botão: Finalizar Atendimento]
L --&gt; M[SISTEMA: Grava Snapshot de Preços]
L --&gt; N[SISTEMA: Marca status como 'Aberto para Faturamento']

# 5. Definição de Interface (Campos de Tela)

## Tela 1: Central Operacional (Dashboard)

Visão rápida do dia.

- Lista de Últimos Atendimentos: Tabela com os 10 últimos lançamentos.
- Botão de Ação Principal: "+ Novo Atendimento" (Bem grande e visível).
- Busca Rápida: Campo para digitar CPF ou Nome e achar o histórico.

## Tela 2: Novo Atendimento (O Formulário Inteligente)

### Passo 1: Quem?

- Busca de Funcionário (Autocomplete por CPF/Nome).
- Se não achar: Botão "Cadastrar Rápido" (Modal com Nome, CPF, Nascimento, Select de Cargo).

### Passo 2: O Quê?

- Cliente: (Vem automático do cadastro do funcionário, mas editável).
- Setor/Cargo: (Vem automático, mas editável caso seja Mudança de Função).
- Tipo de Exame: (Select: Admissional, Periódico, Demissional, etc).
- Data: (Default: Hoje).
- Médico Examiner: (Campo texto livre para digitar quem realizou na clínica parceira).

### Passo 3: Itens (O Financeiro)

- Tabela gerada automaticamente:
- Procedimento | Qtd | Valor Unit. | Total | Ação |
- Audiometria | 1 | R$ 35,00 | R$ 35,00 | [x] |
- Clínico ASO | 1 | R$ 40,00 | R$ 40,00 | [x] |

- Total da Guia: R$ 75,00 (Destaque).
- Botão: "+ Adicionar Item Extra"
