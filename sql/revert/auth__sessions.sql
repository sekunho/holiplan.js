-- Revert holiplan:auth__sessions from pg

BEGIN;
  REVOKE EXECUTE ON FUNCTION auth.do_credentials_match FROM hp_anon, hp_api;
  REVOKE EXECUTE ON FUNCTION auth.authenticate FROM hp_anon;

  DROP FUNCTION auth.do_credentials_match;
  DROP FUNCTION auth.authenticate;

COMMIT;
