# DeepEmotion WebApp 🎥✨

![React](https://img.shields.io/badge/React-19-blue.svg)
![MUI](https://img.shields.io/badge/MUI-v7-blueviolet.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-yellowgreen.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Interface de utilizador moderna e responsiva para a **DeepEmotion API**. Esta aplicação web, construída com React e Material-UI (MUI), permite aos utilizadores registarem-se, fazerem login, enviarem vídeos e visualizarem análises de emoções detalhadas, frame a frame, com gráficos interativos.

Este projeto foi inicializado com [Vite](https://vitejs.dev/).

---

## 🏛️ Arquitetura e Estrutura

Este projeto segue uma arquitetura **"Por Tipo" (Type-Based)**, que organiza os ficheiros com base no seu papel técnico dentro da aplicação. Esta abordagem promove uma clara separação de responsabilidades e é intuitiva para projetos de pequena a média dimensão.

* `src/api`: Centraliza toda a comunicação com o backend Flask.
* `src/components`: Contém todos os componentes React reutilizáveis, organizados em subpastas (auth, dashboard, layout, etc.).
* `src/contexts`: Gere o estado global, como o `AuthContext` para a autenticação.
* `src/hooks`: Armazena hooks customizados para lógicas reutilizáveis.
* `src/layouts`: Define a estrutura visual das páginas (ex: com Navbar e Sidebar).
* `src/pages`: Componentes que representam uma página inteira da aplicação.

---

## 🛠️ Stack de Tecnologias

* **Framework:** React 19
* **Biblioteca de UI:** Material-UI (MUI) v7
* **Roteamento:** React Router DOM
* **Cliente HTTP:** Axios
* **Gráficos:** Recharts
* **Ferramenta de Build:** Vite

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js (versão 18+ recomendada)
* npm ou yarn / pnpm
* A [DeepEmotion API](<URL_DO_SEU_BACKEND_REPO>) a correr localmente ou num ambiente de desenvolvimento.

### 1. Clonar o Repositório
```bash
git clone <url-do-seu-repositorio-frontend>
cd deep-emotion-webapp
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar o Ambiente
Crie um ficheiro `.env` na raiz do projeto para configurar a URL da sua API.

```bash
# Crie o ficheiro .env
touch .env
```
Dentro do `.env`, adicione a seguinte linha, ajustando a porta se necessário:
```env
VITE_API_BASE_URL=[http://127.0.0.1:5000/api/v1](http://127.0.0.1:5000/api/v1)
```
*Isto permite que a aplicação React saiba onde encontrar a sua API Flask.*

### 4. Executar a Aplicação
```bash
npm run dev
```
A aplicação estará agora disponível em `http://localhost:5173` (ou na porta que o Vite indicar no terminal).

---

##  scripts Disponíveis

No diretório do projeto, pode executar:

### `npm run dev`
Executa a aplicação no modo de desenvolvimento.
Abra [http://localhost:5173](http://localhost:5173) para a ver no seu navegador.

### `npm run build`
Compila a aplicação para produção na pasta `dist`.
Otimiza a compilação para a melhor performance.

---