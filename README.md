# ⚽ Manto Surpresa

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Pix-009EE3?style=for-the-badge&logo=mercadopago&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

<p align="center">
  <b>A experiência definitiva para colecionadores e amantes de futebol: caixas-surpresa com camisas misteriosas de clubes e seleções do mundo todo!</b>
</p>

</div>

---

## 📌 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Pré-requisitos](#-pré-requisitos)
- [Guia de Instalação e Execução](#-guia-de-instalação-e-execução)
  - [1. Clonando o Repositório](#1-clonando-o-repositório)
  - [2. Configuração do Backend (FastAPI)](#2-configuração-do-backend-fastapi)
  - [3. Configuração do Frontend (Next.js)](#3-configuração-do-frontend-nextjs)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Fluxo de Pagamento e Notificações](#-fluxo-de-pagamento-e-notificações)
- [Integração Contínua (CI/CD)](#-integração-contínua-cicd)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **Manto Surpresa** é uma plataforma de e-commerce voltada à venda de caixas-surpresa (*mystery boxes*) contendo mantos de futebol nacionais e internacionais. O conceito une a paixão pelo futebol com a emoção do fator surpresa: o cliente seleciona a categoria da caixa desejada, informa o tamanho da camisa e recebe uma peça misteriosa em seu endereço.

Este projeto foi concebido e desenvolvido no âmbito da disciplina de **Projeto Integrador** do curso de **Bacharelado em Engenharia de Software** do **Instituto Federal de Educação, Ciência e Tecnologia do Amazonas (IFAM) - Campus Parintins**, consolidando práticas de arquitetura de software, desenvolvimento full stack, segurança e integração de serviços terceiros.

---

## ✨ Funcionalidades

- **Catálogo Interativo de Caixas**: Vitrine com carrossel responsivo apresentando as opções de caixas, descrições detalhadas, valores e fotos.
- **Personalização de Pedido**: Seleção de quantidades e grade de tamanhos (P, M, G, GG, etc.) por produto.
- **Carrinho de Compras Reativo**: Gerenciamento de estado global com persistência em tempo de execução via Zustand.
- **Checkout Transparente**:
  - Consulta e autopreenchimento dinâmico de endereço a partir do CEP via **ViaCEP API**.
  - Validação rigorosa de formulários ponta a ponta com **React Hook Form** e **Zod**.
- **Pagamento Instantâneo via Pix (Mercado Pago)**:
  - Criação de cobrança Pix diretamente pela API do Mercado Pago.
  - Renderização instantânea de QR Code e código copia-e-cola (BR Code).
  - Sincronização e monitoramento de pagamento via **Webhooks** e verificação programática de status.
- **Notificações Transacionais por E-mail**:
  - E-mail com instruções e link de pagamento na criação do pedido.
  - E-mail de confirmação imediata após a aprovação do Pix.
- **Autenticação Passwordless (OTP + JWT)**:
  - Login seguro e sem senha para acompanhamento de compras.
  - Envio de código OTP (*One-Time Password*) de 6 dígitos com expiração temporizada.
  - Emissão de tokens JWT (*JSON Web Tokens*) assinados para autenticação de requisições.
- **Área do Cliente e Rastreamento de Pedidos (`/tracking`)**:
  - Consulta do histórico completo de pedidos do cliente autenticado.
  - Acompanhamento do status de cada pedido em tempo real (*Pendente*, *Pago*, *Cancelado*, etc.).
- **Design Moderno e Responsivo**:
  - Interface baseada no Tailwind CSS v4 com toques neobrutalistas sutis, transições interativas e suporte multiplataforma (mobile, tablet e desktop).

---

## 🛠️ Arquitetura e Tecnologias

A aplicação é estruturada em um monorepo desacoplado, com comunicação via API RESTful:

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (versão 16, App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Biblioteca de UI**: [React](https://react.dev/) 19
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) v4 & Componentes utilitários inspirados no Shadcn UI
- **Gerenciamento de Estado**: [Zustand](https://github.com/pmndrs/zustand)
- **Validação de Formulários**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Carrossel & Interações**: [Embla Carousel](https://www.embla-carousel.com/) & Lucide Icons

### Backend
- **Linguagem**: [Python](https://www.python.org/) 3.12+
- **Framework Web**: [FastAPI](https://fastapi.tiangolo.com/) (ASGI assíncrono de alto desempenho)
- **Servidor ASGI**: [Uvicorn](https://www.uvicorn.org/)
- **Banco de Dados & ORM**: [PostgreSQL](https://www.postgresql.org/) (com suporte a SQLite) gerenciado via [SQLAlchemy](https://www.sqlalchemy.org/) 2.0
- **Migrações de Banco de Dados**: [Alembic](https://alembic.sqlalchemy.org/)
- **Segurança & Tokens**: [python-jose](https://github.com/mpdavis/python-jose) (JWT) e [Passlib](https://passlib.readthedocs.io/)
- **Serviços Externos**:
  - **Mercado Pago SDK & REST API**: Processamento de pagamentos Pix.
  - **SMTP Gmail (smtplib)**: Envio de e-mails transacionais e códigos OTP.
  - **ViaCEP**: Consulta de código postal brasileiro.

---

## 📁 Estrutura do Repositório

```text
manto-surpresa/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml         # Pipeline de CI do Backend (Python/pip)
│       └── frontend-ci.yml        # Pipeline de CI do Frontend (Node.js/npm)
├── manto-surpresa-backend/        # API FastAPI
│   ├── app/
│   │   ├── alembic/               # Histórico e migrações do banco de dados
│   │   ├── routes/                # Controladores e rotas (box, order, otp, webhook)
│   │   ├── services/              # Regras de negócio (order, box, otp, email, mercado_pago)
│   │   ├── dependencies.py        # Injeção de dependências e validação de autenticação
│   │   ├── main.py                # Ponto de entrada FastAPI e configuração de CORS
│   │   ├── models.py              # Modelos relacionais SQLAlchemy
│   │   ├── schemas.py             # Schemas de validação Pydantic
│   │   └── security.py            # Utilitários de token JWT e hashing
│   ├── .env-example               # Exemplo de variáveis de ambiente do backend
│   ├── requirements.txt           # Dependências Python
│   └── vercel.json                # Configuração para deploy serverless
├── manto-surpresa-frontend/       # Aplicação Web Next.js
│   ├── app/                       # Rotas App Router (home, box, checkout, tracking, etc.)
│   ├── components/                # Componentes reutilizáveis (cart, header, footer, ui)
│   ├── services/                  # Clientes HTTP e chamadas às APIs
│   ├── stores/                    # Armazenamento Zustand (carrinho, autenticação)
│   ├── types/                     # Definições de tipagem TypeScript
│   ├── public/                    # Mídias estáticas e assets
│   ├── package.json               # Dependências e scripts do frontend
│   └── tailwind.config.ts         # Configurações do Tailwind CSS
├── LICENSE                        # Licença MIT
└── README.md                      # Documentação do projeto
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em seu ambiente:

- [Git](https://git-scm.com/)
- [Python 3.12](https://www.python.org/) ou superior
- [Node.js 20](https://nodejs.org/) ou superior e gerenciador de pacotes `npm`
- (Opcional) Instância de banco de dados [PostgreSQL](https://www.postgresql.org/) (ou utilize o SQLite padrão para desenvolvimento rápido)

---

## 🚀 Guia de Instalação e Execução

### 1. Clonando o Repositório

```bash
git clone https://github.com/matheushnobre/manto-surpresa.git
cd manto-surpresa
```

---

### 2. Configuração do Backend (FastAPI)

1. Acesse o diretório do backend:
   ```bash
   cd manto-surpresa-backend
   ```

2. Crie e ative um ambiente virtual Python:
   - **Linux / macOS**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure as variáveis de ambiente criando o arquivo `.env`:
   ```bash
   cp .env-example .env
   ```
   *Preencha o `.env` com suas credenciais (consulte a seção [Variáveis de Ambiente](#-variáveis-de-ambiente)).*

5. Execute as migrações do banco de dados com o Alembic:
   ```bash
   alembic -c app/alembic.ini upgrade head
   ```

6. Inicie o servidor da API:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   A API estará acessível em `http://localhost:8000`. A documentação interativa estará disponível em `http://localhost:8000/docs`.

---

### 3. Configuração do Frontend (Next.js)

1. Em um novo terminal, acesse o diretório do frontend:
   ```bash
   cd manto-surpresa-frontend
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Crie o arquivo de variáveis de ambiente `.env.local`:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O frontend estará acessível em `http://localhost:3000`.

---

## 🔐 Variáveis de Ambiente

### Backend (`manto-surpresa-backend/.env`)

| Variável | Descrição | Exemplo / Padrão |
| :--- | :--- | :--- |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token de acesso para a API do Mercado Pago | `APP_USR-...` |
| `USER_EMAIL` | Conta de e-mail remetente (SMTP Gmail) | `seu-email@gmail.com` |
| `PASSWORD_EMAIL` | Senha de aplicativo do Gmail para autenticação SMTP | `xxxx xxxx xxxx xxxx` |
| `STORAGE_DATABASE_URL` | URL de conexão com o banco de dados relacional | `postgresql://user:pass@host:5432/db` ou `sqlite:///./app/banco.db` |
| `STORAGE_DATABASE_URL_UNPOOLED` | URL de conexão direta (sem pooling) caso use Neon/Supabase | `postgresql://...` |
| `JWT_SECRET_KEY` | Chave secreta para assinatura dos tokens JWT | `uma-chave-longa-e-segura` |
| `JWT_ALGORITHM` | Algoritmo de criptografia do token JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tempo de expiração do token de sessão (em minutos) | `15` |

### Frontend (`manto-surpresa-frontend/.env.local`)

| Variável | Descrição | Exemplo / Padrão |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL base do backend FastAPI | `http://localhost:8000` |

---

## 📡 Endpoints da API

A documentação Swagger interativa pode ser explorada diretamente em `/docs` ou `/redoc`. Abaixo estão os principais endpoints:

### Caixas (`/box`)
- `GET /box/` — Lista todas as caixas-surpresa disponíveis no catálogo.
- `GET /box/{id}` — Retorna os dados detalhados de uma caixa específica.
- `POST /box/add` — Cadastra uma nova caixa no sistema.

### Pedidos (`/order`)
- `POST /order/create` — Registra um novo pedido com os itens do carrinho, dados do cliente e endereço, gerando o pagamento Pix correspondente.
- `GET /order/my-orders` — Retorna todos os pedidos pertencentes ao cliente autenticado via token JWT no cabeçalho `Authorization: Bearer <token>`.
- `GET /order/{order_id}` — Detalhes de um pedido por ID.
- `GET /order/{order_id}/status` — Consulta o status de pagamento de um pedido.

### Autenticação OTP (`/otp`)
- `POST /otp/` — Gera um código de verificação temporário de 6 dígitos e envia ao e-mail informado.
- `POST /otp/verify` — Valida o código OTP e retorna um JWT para autenticação das rotas protegidas.

### Webhook (`/webhook`)
- `POST /webhook/mercadopago` — Endpoint para recepção de notificações assíncronas do Mercado Pago sobre atualizações no status de transações Pix.

---

## 🔄 Fluxo de Pagamento e Notificações

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    participant Frontend as Frontend (Next.js)
    participant Backend as Backend (FastAPI)
    participant MP as Mercado Pago
    participant SMTP as Serviço SMTP

    Cliente->>Frontend: Finaliza pedido no Checkout
    Frontend->>Backend: POST /order/create
    Backend->>MP: Cria ordem de pagamento Pix
    MP-->>Backend: Retorna dados Pix (QR Code, Copia e Cola)
    Backend->>SMTP: Envia e-mail de "Pedido criado" com link de pagamento
    Backend-->>Frontend: Retorna QR Code Pix e ID do pedido
    Frontend-->>Cliente: Exibe QR Code na tela

    alt Notificação via Webhook
        MP->>Backend: POST /webhook/mercadopago (Status: Approved)
        Backend->>Backend: Atualiza status do pedido para "Pago"
        Backend->>SMTP: Envia e-mail de "Pedido Confirmado"
    else Consulta / Polling
        Frontend->>Backend: GET /order/{id}/status
        Backend->>MP: Consulta status do pagamento
        Backend-->>Frontend: Retorna status atualizado ("Pago")
    end

    Frontend-->>Cliente: Exibe tela de confirmação de pagamento com sucesso
```

---

## 🧪 Integração Contínua (CI/CD)

O repositório conta com automação via **GitHub Actions** configurada no diretório `.github/workflows/`:

- **Backend CI (`backend-ci.yml`)**: Valida o ambiente em ambiente Ubuntu executando Python 3.12 e instalando dependências para garantir integridade estrutural.
- **Frontend CI (`frontend-ci.yml`)**: Executa validações de linting (`eslint`) e compilação do build de produção (`next build`) para assegurar conformidade do código a cada push ou pull request na branch `main`.

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Para mais informações, consulte o arquivo [LICENSE](LICENSE).

---

<div align="center">
  Desenvolvido com 💚 para o <b>Projeto Integrador</b> — Engenharia de Software no <b>IFAM Campus Parintins</b>.
</div>
