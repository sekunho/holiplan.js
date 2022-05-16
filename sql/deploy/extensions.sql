-- Deploy holiplan:extensions.sql to pg

BEGIN;

CREATE EXTENSION pgtap;
CREATE EXTENSION btree_gist;

COMMIT;
