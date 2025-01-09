-- +goose Up

-- +goose StatementBegin
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- +goose StatementEnd


-- +goose StatementBegin
CREATE TRIGGER enforce_created_at_immutable
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION prevent_created_at_update();
-- +goose StatementEnd

-- +goose Down

DROP TRIGGER IF EXISTS set_updated_at ON documents;
DROP TRIGGER IF EXISTS enforce_created_at_immutable ON documents;


