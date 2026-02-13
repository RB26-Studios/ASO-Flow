27/01/2026

# Especificação Funcional: Módulo Financeiro

Sistema: Gestão de Saúde Ocupacional (SaaS) Versão: 1.0

## 1. Visão Geral

Este módulo é responsável pelo fechamento de caixa e cobrança. Ele consolida os exames realizados no Módulo Operacional em faturas mensais organizadas por cliente.

**Objetivo Principal:** Automatizar a geração de relatórios de cobrança, garantindo que nenhum exame realizado deixe de ser faturado e que os valores cobrados correspondam exatamente ao que foi acordado (respeitando os snapshots).

## Atores Envolvidos:

- Administrador / Financeiro: Único perfil com permissão para fechar faturas e marcar pagamentos.

## 2. Histórias de Usuário (User Stories)

### US-07: Geração de Fatura Mensal (Fechamento)

Como Administrador, Quero selecionar um cliente e um mês de referência (ex: Janeiro/2026), Para que o sistema busque todos os exames realizados naquele período e gere um relatório de cobrança único.

### US-08: Controle de Recebimentos

Como Administrador, Quero marcar uma fatura como "Paga", Para que eu possa distinguir quem está inadimplente e o sistema pare de cobrar esses exames.

### US-09: Envio de Cobrança

Como Administrador, Quero exportar a fatura em PDF ou gerar um link de visualização, Para que eu possa enviar para o e-mail financeiro do cliente.

## 3. Requisitos Funcionais (Regras de Sistema)

### 3.1. Processamento de Faturas

|  ID | Descrição do Requisito | Regra de Negócio (RN) associada  |
| --- | --- | --- |
|  RF-030 | O sistema deve agrupar atendimentos por Cliente + Mês de Competência. | RN-30: Organização contábil padrão.  |


RF- 031 A soma total deve usar exclusivamente o campo price_charged dos itens.
RN-31 (Integridade): Jamais recalcular preços baseados na tabela atual. O valor válido é o do dia do exame.

RF- 032 Ao gerar a fatura (Status: Enviada), o sistema deve travar os atendimentos vinculados.
RN-32: Impede que um operador edite ou exclua um exame que já foi cobrado do cliente.

RF- 033 O sistema deve permitir adicionar um link externo (URL do Boleto/NF-e).
RN-33: O sistema não é um banco nem emissor de NF-e, ele apenas gerencia a cobrança administrativa.

# 4. Fluxogramas de Processo

## Fluxo A: Fechamento de Mês (Ciclo de Cobrança)

```txt
graph TD
A[Início: Painel Financeiro] --&gt; B[Selecionar Mês de Referência]
B --&gt; C[Sistema lista Clientes com exames 'Em Aberto']
C --&gt; D[Selecionar Cliente para Faturar]
D --&gt; E[SISTEMA: Busca itens não faturados do período]
E --&gt; F[Preview da Fatura: Lista de Exames + Soma Total]
F --&gt; G{Dados Corretos?}
G --&gt; Não --&gt; H[Corrigir lançamentos no Operacional]
G --&gt; Sim --&gt; I[Botão: Gerar Fatura]
I --&gt; J[SISTEMA: Cria registro na tabela 'invoices']
J --&gt; K[SISTEMA: Atualiza status dos exames para 'Faturado']
K --&gt; L[Enviar PDF para o Cliente]
```

## Fluxo B: Baixa de Pagamento

```txt
graph LR
A[Lista de Faturas 'Em Aberto'] --&gt; B[Identificar Pagamento no Banco]
B --&gt; C[Clicar em 'Dar Baixa']
C --&gt; D[Mudar Status para 'Pago']
D --&gt; E[Fim do Ciclo]
```

# 5. Definição de Interface (Campos de Tela)

## Tela 1: Dashboard Financeiro

- Cards de Resumo (KPIs):
- Total Faturado (Mês Atual).
- Total Recebido.


- Total Inadimplente (Vencido).
- Tabela de Faturas Recentes: Lista as últimas faturas geradas e seus status.

# Tela 2: Gerar Faturamento (Wizard)

1. Filtro: Mês/Ano (ex: 06/2026).
2. Lista de Clientes Pendentes:

- Padaria do João (15 exames pendentes) - Prévia: R$ 450,00 [Botão: Faturar]
- Construtora X (2 exames pendentes) - Prévia: R$ 100,00 [Botão: Faturar]

# Tela 3: Detalhe da Fatura (O Documento)

Esta tela é o espelho do PDF que o cliente recebe.

Cabeçalho: Logo da Consultoria + Dados do Cliente. Corpo (Tabela Detalhada):

- Data | Funcionário | Procedimento | Valor
- 10/06 | Gaj (Motorista) | Audiometria | R$ 35,00
- 10/06 | Gaj (Motorista) | Clínico | R$ 40,00 Rodapé:
- TOTAL A PAGAR: R$ 75,00
- Vencimento: 20/06/2026
- Campo para colar Link do Boleto.
- Botão: "Baixar PDF" / "Enviar por E-mail".

# 6. Modelo de Relatório (Output)
