# API de Notas (Back-end)

API REST para gerenciar notas, desenvolvida com **Node.js** e **Express.js**. Os dados são salvos em um arquivo local `data.json`, que funciona como um banco de dados simples.

Este projeto é o back-end da atividade de CRUD de notas. O front-end que consome esta API está em outro repositório (veja a seção **Links**).

## Links

- **API online (Render):** https://api-notas-backend.onrender.com/api/notes
- **Repositório do front-end:** https://github.com/blightpb/api-notas-frontend
- **Front-end online (Vercel):** https://api-notas-frontend.vercel.app

> Observação: o plano gratuito do Render suspende o serviço após um período sem uso. A primeira requisição pode levar cerca de 50 segundos para responder.

## Tecnologias

- Node.js
- Express.js
- body-parser
- Módulos nativos `fs` e `path`
- Arquivo JSON como armazenamento
- Render (deploy)

## Estrutura do projeto

```
api-notas-backend/
├── server.js        # servidor e rotas
├── data.json        # armazenamento das notas
├── package.json     # dependências e scripts
└── .gitignore
```

## Como executar localmente

Pré-requisito: [Node.js](https://nodejs.org) instalado.

```bash
# 1. clonar o repositório
git clone https://github.com/SEU_USUARIO/api-notas-backend.git
cd api-notas-backend

# 2. instalar as dependências
npm install

# 3. iniciar o servidor
npm start
```

O servidor ficará disponível em `http://localhost:3000`. Para testar, acesse `http://localhost:3000/api/notes` no navegador. O resultado inicial é `[]`.

## Modelo de dados

Cada nota é salva com esta estrutura:

```json
{
  "id": "1730000000000",
  "titulo": "Comprar pão",
  "texto": "Ir na padaria",
  "criadoEm": "2026-11-05T22:00:00.000Z"
}
```

| Campo | Descrição |
|---|---|
| `id` | Identificador gerado automaticamente (texto) |
| `titulo` | Título da nota (obrigatório) |
| `texto` | Conteúdo da nota (obrigatório) |
| `criadoEm` | Data e hora de criação, gerada automaticamente |

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/notes` | Lista todas as notas |
| GET | `/api/notes/:id` | Busca uma nota pelo ID |
| POST | `/api/notes` | Cria uma nova nota |
| PUT | `/api/notes/:id` | Atualiza uma nota existente |
| DELETE | `/api/notes/:id` | Exclui uma nota |

### Exemplos

**Criar nota**

```http
POST /api/notes
Content-Type: application/json

{
  "titulo": "Estudar Express",
  "texto": "Revisar rotas e middlewares"
}
```

Resposta `201 Created`:

```json
{
  "id": "1730000000000",
  "titulo": "Estudar Express",
  "texto": "Revisar rotas e middlewares",
  "criadoEm": "2026-11-05T22:00:00.000Z"
}
```

**Editar nota**

```http
PUT /api/notes/1730000000000
Content-Type: application/json

{
  "titulo": "Estudar Express (atualizado)",
  "texto": "Revisar rotas, middlewares e CORS"
}
```

**Excluir nota**

```http
DELETE /api/notes/1730000000000
```

Resposta `204 No Content`.

### Códigos de resposta

| Código | Significado |
|---|---|
| 200 | Requisição bem-sucedida |
| 201 | Nota criada |
| 204 | Nota excluída |
| 400 | Dados inválidos (título ou texto ausentes) |
| 404 | Nota não encontrada |

## Como funciona

- `readNotes()` lê o `data.json` e devolve a lista de notas.
- `writeNotes()` grava a lista atualizada de volta no arquivo.
- Cada rota lê o arquivo, altera os dados em memória e salva o resultado.
- Um middleware de **CORS** libera o acesso para aplicações front-end hospedadas em outros domínios.
- A porta do servidor vem de `process.env.PORT` (definida pelo Render) ou usa `3000` localmente.

## Deploy no Render

1. Criar um **Web Service** conectado a este repositório.
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`
4. **Instance Type:** Free

## Limitações

- O armazenamento em arquivo JSON não escala e não é indicado para produção.
- No plano gratuito do Render, o `data.json` volta ao estado do repositório sempre que o serviço reinicia ou recebe um novo deploy, então as notas criadas podem ser perdidas.
- Não há autenticação nem suporte a múltiplos usuários.
- Escritas simultâneas podem causar conflito no arquivo.

## Possíveis melhorias

- Trocar o JSON por um banco de dados (MongoDB, PostgreSQL ou MySQL)
- Adicionar autenticação com JWT
- Validar os dados com Joi ou Zod
- Separar rotas e controllers em arquivos próprios
- Criar testes automatizados
