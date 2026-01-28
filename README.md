# ASOFlow - Gestão de Saúde Ocupacional (SaaS)

Sistema **SaaS B2B** desenvolvido para **Consultorias de Saúde e Segurança do Trabalho**, responsável por gerenciar todo o ciclo de vida **operacional e financeiro** dos exames ocupacionais (ASO) — do cadastro do funcionário à emissão da fatura consolidada para a empresa cliente.

---

## 🚀 Visão Geral

O sistema atua como um **hub administrativo**, permitindo que a consultoria:

* Registre exames realizados em **clínicas parceiras**
* Aplique **regras de precificação complexas** (tabelas personalizadas por cliente)
* Automatize o **fechamento financeiro mensal**

Tudo isso com foco em **padronização, escalabilidade e redução de erros operacionais**.

---

## 🧩 Principais Módulos

### 🏢 Administrativo

* Gestão da própria consultoria (**Tenant**)
* Controle de usuários e permissões de acesso

### 🤝 Comercial

* Gestão de contratos
* Tabelas de preços personalizadas por cliente
* Definição de protocolos de exames por cargo (**PCMSO**)

### 🩺 Operacional

* Registro de atendimentos
* Cálculo automático de exames obrigatórios
* Controle de vigência do **ASO**

### 💰 Financeiro

* Agrupamento de atendimentos por período
* Geração de faturas mensais
* Controle de inadimplência

---

## 🛠️ Stack Tecnológica

A arquitetura foi projetada para **alta performance**, **tipagem estrita** e **velocidade de desenvolvimento**.

* **Framework:** Next.js 15 (App Router & Server Actions)
* **Linguagem:** TypeScript
* **Banco de Dados & Auth:** Supabase (PostgreSQL)
* **Estilização:** Tailwind CSS
* **Componentes UI:** shadcn/ui (Radix UI)
* **Validação:** Zod
* **Geração de PDF:** @react-pdf/renderer

---

## 📦 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

* Node.js **18+**
* Conta ativa no **Supabase**

---

## 🔧 Instalação e Configuração

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/sso-consultoria.git
cd sso-consultoria
```

### 2️⃣ Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3️⃣ Configuração do Ambiente

Crie um arquivo **.env.local** na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui
```

### 4️⃣ Banco de Dados

No **SQL Editor do Supabase**, execute o script de migração localizado em:

```
/docs/database/schema.sql
```

Ou consulte a documentação técnica para mais detalhes.

### 5️⃣ Rodando o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📂 Estrutura do Projeto

A organização segue o padrão **Feature-Based**, facilitando manutenção e escalabilidade.

```text
/src
  /app                  # Rotas (Next.js App Router)
    /(auth)             # Login / Recuperação de senha
    /(dashboard)        # Área logada (Admin, Comercial, Operacional, Financeiro)

  /components
    /ui                 # Componentes base (shadcn/ui)
    /features           # Componentes de negócio (ex: AsoForm)

  /lib
    /validations        # Schemas de validação (Zod)
    supabase.ts         # Cliente Supabase

  /services             # Server Actions (lógica de banco)
  /types                # Tipagens TypeScript
```

---

## 📄 Documentação

Toda a documentação técnica e funcional encontra-se na pasta **/docs**:

* 📘 Modelagem de Dados e Banco (PDF)
* 📙 Especificação Funcional — Administrativo
* 📙 Especificação Funcional — Comercial
* 📙 Especificação Funcional — Operacional
* 📙 Especificação Funcional — Financeiro

---

## 🤝 Contribuição

Este é um **projeto proprietário**.

Pull requests são aceitos **exclusivamente** da equipe interna.

---

## 📝 Licença

© 2026 **Gaj**. Todos os direitos reservados.
