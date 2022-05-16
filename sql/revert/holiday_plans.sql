-- Revert holiplan:holiday_plans from pg

BEGIN;

DROP SCHEMA app CASCADE;

COMMIT;
