-- ============================================================
-- Table des conversations avec les professeurs IA
-- ------------------------------------------------------------
-- Une ligne par élève ET par matière.
--
-- À exécuter une seule fois dans Supabase :
--   Dashboard → SQL Editor → coller ce fichier → Run
--
-- Tant que la table n'existe pas, l'application continue de
-- fonctionner : profs-store.js sauvegarde dans le navigateur.
-- ============================================================

create table if not exists public.ai_conversations (
    user_id    uuid        not null references auth.users(id) on delete cascade,
    agent_id   text        not null,
    messages   jsonb       not null default '[]'::jsonb,
    updated_at timestamptz not null default now(),
    primary key (user_id, agent_id)
);

-- Retrouver rapidement les conversations d'un élève.
create index if not exists ai_conversations_user_idx
    on public.ai_conversations (user_id, updated_at desc);

-- ── Sécurité : chaque élève ne voit que ses propres conversations ──
alter table public.ai_conversations enable row level security;

drop policy if exists "lecture de ses conversations"     on public.ai_conversations;
drop policy if exists "ecriture de ses conversations"    on public.ai_conversations;
drop policy if exists "mise a jour de ses conversations" on public.ai_conversations;
drop policy if exists "suppression de ses conversations" on public.ai_conversations;

create policy "lecture de ses conversations"
    on public.ai_conversations for select
    using (auth.uid() = user_id);

create policy "ecriture de ses conversations"
    on public.ai_conversations for insert
    with check (auth.uid() = user_id);

create policy "mise a jour de ses conversations"
    on public.ai_conversations for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "suppression de ses conversations"
    on public.ai_conversations for delete
    using (auth.uid() = user_id);
