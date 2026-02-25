# Guia de Git

## Comandos
### 1. Configuração e Início
Antes de tudo, você precisa se identificar e criar seu repositório.

- `git config --global user.name "Seu Nome"`: Define seu nome para os registros.
- `git config --global user.email "seu@email.com"`: Define seu e-mail.
- `git init`: Transforma a pasta atual em um repositório Git (cria a pasta oculta .git).
- `git clone [url]`: Baixa um projeto pronto de um servidor (como GitHub ou GitLab).

### 2. Ciclo de Alterações (O "Pão com Manteiga")
Este é o fluxo que você repetirá várias vezes ao dia: Alterar → Salvar → Registrar.

- `git status`: O comando mais importante. Mostra o que foi modificado e o que está pronto para ser salvo.
- `git add [arquivo]`: Adiciona um arquivo específico para a "área de espera" (staging area).
- `git add .`: Adiciona todas as mudanças de uma vez.
- `git commit -m "mensagem"`: Grava permanentemente suas alterações no histórico com uma descrição do que foi feito.

### 3. Sincronização com o Servidor
Para enviar seu código para a nuvem ou baixar o trabalho dos colegas.

- `git push origin [branch]`: Envia seus commits locais para o servidor remoto.
- `git pull`: Traz as novidades do servidor e as mescla automaticamente no seu código.
- `git fetch`: Baixa as novidades do servidor, mas não mexe no seu código (útil para revisar antes de mesclar).

### 4. Ramificações (Branches) e Organização
Branches permitem que você trabalhe em uma nova funcionalidade sem estragar a versão principal que está funcionando.

- `git branch`: Lista as branches existentes.
- `git checkout -b [nome-da-branch]`: Cria uma nova ramificação e já pula para dentro dela.
- `git checkout [nome-da-branch]`: Alterna entre branches existentes.
- `git merge [nome-da-branch]`: Une as alterações de uma branch na branch em que você está atualmente.

### 5. Investigação e Desfazendo Erros
Às vezes a gente faz besteira. O Git serve justamente para consertar isso.

- `git log`: Mostra o histórico de todos os commits feitos no projeto.
- `git diff`: Mostra exatamente quais linhas de código mudaram nos arquivos.
- `git reset --hard HEAD`: Cuidado! Apaga todas as suas mudanças locais e volta para o estado do último commit.
- `git revert [hash-do-commit]`: Cria um novo commit que desfaz exatamente o que um commit antigo fez (forma segura de desfazer erros).

## Boas praticas

### 1. Padrão de Commits (Conventional Commits)
O mercado adotou um formato quase universal que segue a estrutura:
`tipo(escopo): descrição curta em letras minúsculas`.

Os tipos mais comuns:

- `feat`: Uma nova funcionalidade.
- `fix`: Correção de um erro (bug).
- `docs`: Mudanças apenas na documentação (ex: README).
- `style`: Formatação, pontos e vírgulas (não altera o comportamento do código).
- `refactor`: Mudança no código que não corrige erro nem adiciona funcionalidade (melhoria de escrita).
- `test`: Adição ou correção de testes.
- `chore`: Atualização de tarefas de build, pacotes ou ferramentas (ex: atualizar o .gitignore).

**Exemplos reais**:

- `feat(auth)`: adiciona login com Google
- `fix(api)`: corrige erro 500 ao salvar usuário
- `docs`: atualiza guia de instalação

### 2. Padrão de Nomes de Branch
As branches devem ser curtas, descritivas e usar hifens para separar palavras. O prefixo ajuda a identificar a categoria da tarefa.

**Estrutura recomendada:**
- `tipo/descrição-curta` ou `tipo/numero-da-task-descrição`

- `feature/`: Para novas funcionalidades.

**Ex**: `feature/login-social`

- `bugfix/` ou `hotfix/`: Para correções.

**Ex**: `bugfix/erro-no-calculo`

- `release/`: Preparação para uma nova versão oficial.

**Ex**: `release/v1.2.0`

- `improvement/`: Melhoria em algo que já existe.

**Ex**: `improvement/otimizacao-performance`

### 3. Boas Práticas Adicionais
- **Idioma**: Escolha um e mantenha. Em empresas globais ou projetos open-source, o padrão é Inglês. Em projetos locais, o Português é aceitável, mas evite misturar os dois.

- **Seja Atômico**: Um commit deve fazer apenas uma coisa. Se você corrigiu um erro e adicionou uma funcionalidade, faça dois commits separados. Isso facilita muito se você precisar desfazer apenas uma das ações depois.

- **Imperativo**: No assunto do commit, use o imperativo ("adiciona", "corrige", "remove") em vez do passado ("adicionei", "corrigido"). Pense que o commit é uma instrução para o código.