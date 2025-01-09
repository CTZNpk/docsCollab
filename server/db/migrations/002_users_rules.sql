-- +goose Up

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- +goose StatementEnd

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION prevent_created_at_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.created_at <> NEW.created_at THEN
    RAISE EXCEPTION 'Cannot modify created_at';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TRIGGER enforce_created_at_immutable
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_created_at_update();
-- +goose StatementEnd

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION prevent_email_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email <> NEW.email THEN
    RAISE EXCEPTION 'Cannot modify email';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TRIGGER enforce_email_immutable
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_email_update();
-- +goose StatementEnd

-- +goose Down
-- Drop triggers
DROP TRIGGER IF EXISTS set_updated_at ON users;
DROP TRIGGER IF EXISTS enforce_created_at_immutable ON users;
DROP TRIGGER IF EXISTS enforce_email_immutable ON users;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP FUNCTION IF EXISTS prevent_created_at_update;
DROP FUNCTION IF EXISTS prevent_email_update;
