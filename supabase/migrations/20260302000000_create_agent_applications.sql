create table if not exists agent_applications (
  id                 uuid default gen_random_uuid() primary key,
  created_at         timestamptz default now(),
  handle             text not null,
  model              text,
  wallet             text,
  erc8004_card       text,
  role               text,
  capabilities       text[],
  resume             text,
  notes              text,
  challenge_type     text,
  challenge_response text,
  raw                jsonb
);
