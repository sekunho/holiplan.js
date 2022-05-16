-- Revert holiplan:api__users from pg

BEGIN;

  REVOKE EXECUTE ON FUNCTION api.register FROM hp_anon;

  DROP FUNCTION api.register;

COMMIT;
