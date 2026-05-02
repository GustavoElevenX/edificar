# Migrations do Edificar

Execute os arquivos abaixo no SQL Editor do Supabase, nesta ordem:

1. `migrations/20260502190000_initial_edificar_schema.sql`
2. `migrations/20260502191000_seed_initial_themes.sql`

A primeira migration cria:

- perfis de usuários;
- preferências do usuário;
- temas/caminhos;
- logs de geração de conteúdo;
- momentos gerados;
- inscritos do diário;
- entregas diárias futuras;
- doações;
- índices, triggers e políticas RLS.

A segunda migration popula os temas iniciais da página Caminhos.

Se você já executou o `schema.sql` antigo, a migration inicial também adiciona as colunas que faltam.
