# 📝 To-Do List - Frontend React

Este é o projeto **Frontend** de uma aplicação de gerenciamento de tarefas (To-Do List), desenvolvido com **React + Vite**. Ele consome uma **API ASP.NET Core** para realizar operações de criação, edição, exclusão e finalização de tarefas.

---

## 🚀 Funcionalidades

- ✅ Criar tarefas com título e descrição
- 📝 Editar tarefas existentes
- 📌 Filtrar tarefas por status: Pendente, Em Progresso e Concluída
- 📅 Definir data de conclusão
- 🗑️ Excluir tarefas com confirmação
- ✔️ Marcar tarefas como concluídas com alerta de sucesso

---

## 🛠 Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Axios](https://axios-http.com/) para consumo da API
- [CSS Modules](https://github.com/css-modules/css-modules) para estilização

---

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos

- Node.js instalado (versão recomendada: 18+)
- Git instalado
- npm install
- npm run dev

src/
├── App.jsx              # Componente principal
├── App.css              # Estilizações globais
├── services/
│   └── tarefaService.js # Funções para consumo da API

- Conforme está na estrutura entre e troque pro ENDPOINT LOCAL que estiver rodando o back-end:
  - src/services/tarefaService.js > const API_URL = 'https://localhost:44300/api/tarefa'

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio


