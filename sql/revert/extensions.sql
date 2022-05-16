-- Revert holiplan:extensions.sql from pg

BEGIN;

DROP EXTENSION pgtap;
DROP EXTENSION btree_gist;

COMMIT;
