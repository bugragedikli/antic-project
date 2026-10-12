CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT uuidv7(),
  email             TEXT NOT NULL UNIQUE,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  password_hash     TEXT NOT NULL,
  last_login_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  token_version INTEGER NOT NULL DEFAULT 0
);