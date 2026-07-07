# Edificar

Plataforma web cristã para empresários e profissionais pausarem, orarem, refletirem e voltarem o coração para Deus.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://127.0.0.1:3000`.

## Supabase

1. Crie um projeto no Supabase.
2. Copie `Project URL` e `anon public key`.
3. Preencha o arquivo `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA_DO_SUPABASE
AI_API_KEY=SUA_CHAVE_DO_PROVEDOR_DE_CONTEUDO
AI_MODEL=gpt-5.2
```

4. No SQL Editor do Supabase, execute as migrations em `supabase/migrations`, na ordem dos nomes dos arquivos.
5. Em Authentication, habilite login por e-mail e senha.

As sessões ficam persistidas no navegador pelo Supabase Auth com a chave `edificar-auth-session`, entao o usuário continua conectado nesse dispositivo até sair da conta, limpar o navegador ou trocar de dispositivo.

## Geração de conteúdo

A chave do provedor de geração deve ficar em `AI_API_KEY`, sem o prefixo `NEXT_PUBLIC`, porque ela roda apenas nas rotas backend do Next.

- `AI_API_KEY`: chave secreta criada na plataforma do provedor de geração.
- `AI_MODEL`: modelo usado para gerar os momentos. O padrao configurado e `gpt-5.2`.

O conteúdo gerado pela plataforma passa pela rota `/api/moments` ou `/api/daily-moment`. O prompt interno pede título, introdução, referência bíblica, passagem em paráfrase própria, reflexão, oração, pergunta e prática do dia.

## Rotas de banco

- `POST /api/moments`: salva momentos gerados.
- `POST /api/daily-moment`: gera a Palavra de hoje.
- `POST /api/daily-subscribers`: salva inscrições para receber diário.
- `POST /api/donations`: registra apoios voluntarios pendentes.

## Observacao de ambiente

O app compila no Node 18.16.1 atual da maquina. Para producao, prefira Node 20+ e depois atualize Next/Supabase para as linhas mais novas suportadas pelo seu deploy.
