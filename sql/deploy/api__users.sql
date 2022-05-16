-- Deploy holiplan:api__users to pg

BEGIN;
  SET LOCAL ROLE hp_api;

  CREATE FUNCTION api.register(username CITEXT, password TEXT)
    RETURNS VOID
    SECURITY DEFINER
    LANGUAGE PLPGSQL
    AS $$
      BEGIN
        INSERT
          INTO app.users(username, password)
          VALUES (register.username, register.password);
      END;
    $$;

    COMMENT ON FUNCTION api.register IS
      'Registers a new user';

    GRANT EXECUTE ON FUNCTION api.register TO hp_anon;
COMMIT;
