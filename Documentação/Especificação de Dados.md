# Especificação de Dados

Sistema de Gestão de Saúde Ocupacional (SaaS)

Documentação Técnica

27 de janeiro de 2026

## Resumo

Este documento define a modelagem de dados conceitual e lógica para o sistema de Saúde Ocupacional (PCMSO). A estrutura foi projetada para suportar múltiplos clientes, precificação dinâmica, histórico clínico segregado e faturamento automatizado.

## Conteúdo

1. **Visão Geral da Arquitetura**

2. **Módulo Administrativo**
   - **2.1** Entidade: Organização (Tenant)
   - **2.2** Entidade: Usuário (Perfil)

3. **Módulo Comercial**
   - **3.1** Entidade: Cliente (Empresa Contratante)
   - **3.2** Entidade: Cargo / Função
   - **3.3** Entidade: Procedimento (Catálogo)
   - **3.4** Entidade: Preço Personalizado
   - **3.5** Entidade: Protocolo de Exames

4. **Módulo Operacional**
   - **4.1** Entidade: Funcionário (Paciente)
   - **4.2** Entidade: ASO / Atendimento (Evento)
   - **4.3** Entidade: Item do Atendimento

5. **Módulo Financeiro**
   - **5.1** Entidade: Fatura


# 1 Visão Geral da Arquitetura

O banco de dados está organizado em quatro módulos lógicos para garantir integridade e escalabilidade:

1. Módulo Administrativo: Identidade da clínica (Tenant) e controle de acesso.
2. Módulo Comercial: Gestão de clientes, regras de negócio, tabelas de preço e protocolos de risco.
3. Módulo Operacional: Cadastros de pessoas, catálogo de serviços e execução dos atendimentos (ASO).
4. Módulo Financeiro: Consolidação de atendimentos em faturas mensais.

# 2 1. Módulo Administrativo

Quem detém e opera o sistema.

## 2.1 Entidade: Organização (Tenant)

Representa a empresa proprietária do software (Sua Clínica/Consultoria).

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  Razão Social | Texto | Nome jurídico oficial.  |
|  Nome Fantasia | Texto | Nome comercial (ex: GajMed).  |
|  CNPJ | Texto | Identificador fiscal único.  |
|  Inscrição Municipal | Texto | Necessário para emissão de NFS-e.  |
|  CNAE | Texto | Classificação da atividade econômica.  |
|  Endereço Completo | Objeto/Texto | Logradouro, Bairro, Cidade, UF, CEP.  |
|  Telefone | Texto | Contato principal.  |
|  E-mail | Texto | E-mail corporativo.  |
|  Logo URL | Texto (Link) | Caminho da imagem para cabeçalhos.  |
|  Médico Resp. Técnico | Texto | Nome do médico chefe da clínica.  |
|  CRM Resp. Técnico | Texto | CRM/UF do médico chefe (Exigência legal).  |

## 2.2 Entidade: Usuário (Perfil)

Pessoa física que opera o sistema. A autenticação é externa; esta entidade armazena o perfil.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID Usuário | UUID | Vínculo único com o sistema de Auth.  |
|  ID Organização | UUID (FK) | Vínculo de pertencimento.  |
|  Nome Completo | Texto | Nome de exibição.  |
|  E-mail | Texto | Para notificações.  |
|  Função (Role) | Enum | ADMIN (Total) ou OPERADOR (Restrito).  |

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  Status | Booleano | Ativo ou Inativo (Bloqueado).  |

### 2.2.1 Considerações de Persistência e Onboarding

#### Tabela: `profiles`

- **Modificação:**  
  O campo `organization_id` é **NULLABLE** (opcional).

- **Motivo:**  
  Permitir que o primeiro usuário (Administrador / Tenant Owner) crie sua conta no sistema **antes da criação da Organização**, conforme o fluxo de onboarding definido no Módulo Administrativo.

- **Regra Associada:**  
  Após o cadastro da Organização, o sistema deve:
  - Vincular o `profiles.organization_id`
  - Definir o `role` como `ADMIN`

---

#### Nova Tabela: `invites`

Responsável por gerenciar o fluxo de **convite de novos usuários (Operadores ou Administradores)** para a plataforma, garantindo controle, rastreabilidade e segurança no processo de onboarding interno.

**Estrutura sugerida:**

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID (PK) | Identificador único do convite |
| `email` | Texto | Obrigatório |
| `role` | Enum (`user_role`) | Padrão: `OPERADOR` |
| `organization_id` | UUID (FK → organizations.id) | Organização que emitiu o convite |
| `used` | Booleano | Padrão: `false` |
| `created_by` | UUID (FK → auth.users.id) | Usuário ADMIN que gerou o convite |

**Regras de Negócio Associadas:**
- Cada convite pode ser utilizado **apenas uma vez**
- Convites só podem ser criados por usuários com `role = ADMIN`
- Após o aceite do convite:
  - Um registro é criado em `profiles`
  - O usuário é automaticamente vinculado à `organization_id`
  - O campo `used` é marcado como `true`



# 3 2. Módulo Comercial

Regras de negócio e gestão de contratos.

## 3.1 Entidade: Cliente (Empresa Contratante)

Empresas que enviam funcionários para exames.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  Razão Social | Texto | Para Nota Fiscal.  |
|  Nome Fantasia | Texto | Identificação comum.  |
|  CNPJ | Texto | Chave única da empresa.  |
|  CNAE Principal | Texto | Define a atividade base.  |
|  Grau de Risco | Inteiro (1-4) | Crítico: Define a periodicidade dos exames periódicos (Anual ou Bienal).  |
|  Endereço Completo | Texto | Localização da sede.  |
|  Resp. Financeiro | Texto | Nome do contato de cobrança.  |
|  E-mail Financeiro | Texto | Destino das faturas e boletos.  |
|  Médico Coordenador | Texto | Nome/CRM do médico da empresa (se houver).  |
|  Status | Enum | Ativo, Inativo ou Inadimplente.  |

## 3.2 Entidade: Cargo / Função

Define o grupo de risco ocupacional dentro do cliente.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID Cargo | UUID | Identificador.  |
|  ID Cliente | UUID (FK) | Pertence a qual empresa?  |
|  Nome do Cargo | Texto | Ex: “Motorista”, “Pedreiro”.  |
|  CBO | Texto | Código Brasileiro de Ocupações.  |
|  Descrição Riscos | Texto | Ex: “Ruído, Vibração, Poeira”.  |

## 3.3 Entidade: Procedimento (Catálogo)

Lista global de exames disponíveis na clínica.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  Nome | Texto | Ex: “Audiometria Tonal”.  |
|  Tipo | Enum | Clínico, Laboratorial, Imagem.  |
|  Preço Base | Decimal | Preço padrão “de balcão”.  |
|  Código TUSS | Texto | Código ANS (Opcional).  |

## 3.4 Entidade: Preço Personalizado

Tabela de exceção de preços por cliente.

5

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID Cliente | UUID (FK) | Empresa beneficiada.  |
|  ID Procedimento | UUID (FK) | Exame com preço especial.  |
|  Valor Personalizado | Decimal | Valor a ser cobrado para este cliente.  |

## 3.5 Entidade: Protocolo de Exames

Regra que define quais exames um cargo deve realizar.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID Cargo | UUID (FK) | Ex: “Motorista”.  |
|  ID Procedimento | UUID (FK) | Ex: “Audiometria”.  |
|  Tipo de ASO | Enum | Quando fazer? (Admissional, Periódico, Demissional, Todos).  |
|  Periodicidade | Inteiro | (Opcional) Sobrescreve a regra geral.  |

6

# 4.3. Módulo Operacional

Execução dos exames e histórico clínico.

## 4.1 Entidade: Funcionário (O Paciente)

Dados cadastrais da pessoa física. Não contém dados de exames.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID Cliente | UUID (FK) | Empresa atual.  |
|  ID Cargo | UUID (FK) | Função atual.  |
|  Nome Completo | Texto | Nome civil.  |
|  CPF | Texto | Chave única (Indispensável).  |
|  RG | Texto | Identidade.  |
|  Data Nascimento | Data | Essencial para cálculo de idade vs. risco.  |
|  Sexo | Enum (M/F) | Define parâmetros clínicos.  |
|  Matrícula | Texto | ID interno na empresa cliente.  |
|  Data Admissão | Data | Vínculo empregatício.  |
|  Status | Booleano | Ativo ou Demitido.  |

## 4.2 Entidade: ASO / Atendimento (O Evento)

Registro de uma visita do funcionário à clínica.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID Funcionário | UUID (FK) | Quem foi atendido.  |
|  Tipo de Exame | Enum | Admissional, Periódico, Demissional, Retorno, Mudança de Função.  |
|  Data Atendimento | Data/Hora | Momento do exame.  |
|  Médico Examinador | Texto | Nome/CRM de quem assinou.  |
|  Resultado | Enum | Apto, Inapto, Apto com Restrição.  |
|  Data Validade | Data | Calculado: Data Exame + Regra do Risco.  |
|  Status | Enum | Aberto, Concluído, Faturado.  |
|  URL Arquivo | Texto | Link do PDF gerado.  |

## 4.3 Entidade: Item do Atendimento

Detalhe financeiro do ASO. Implementa o padrão Snapshot.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID ASO | UUID (FK) | Vínculo com o atendimento.  |
|  ID Procedimento | UUID (FK) | O que foi realizado.  |
|  Preço Cobrado | Decimal | Snapshot: Valor exato calculado no dia. Imutável mesmo se a tabela mudar.  |

# 5.4. Módulo Financeiro

Fechamento de contas.

7

# 5.1 Entidade: Fatura

Consolidação mensal de cobranças.

|  Atributo | Tipo Sugerido | Descrição/Regra  |
| --- | --- | --- |
|  ID Cliente | UUID (FK) | Quem paga.  |
|  Mês Referência | Data (MM/AAAA) | Competência da fatura.  |
|  Data Emissão | Data | Data de geração.  |
|  Data Vencimento | Data | Prazo para pagamento.  |
|  Valor Total | Decimal | Soma dos “Preços Cobrados” dos Itens.  |
|  Status | Enum | Rascunho, Enviada, Paga, Vencida.  |
|  Link Externo | Texto | URL para Boleto ou NF.  |
