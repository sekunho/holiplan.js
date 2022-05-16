-- Deploy holiplan:auth__sessions to pg

BEGIN;
  SET LOCAL ROLE hp_auth;

  -- This just checks if the credentials are valid. Since the authentication is
  -- handled by JWT, and I can't be arsed to implement the sessions aspect for
  -- logging out, I will just deal with JWT's massive design flaw for user
  -- sessions. I don't understand why people still continue to use this when
  -- it's really, really annoying considering all of its zero day incidents.
  CREATE FUNCTION auth.do_credentials_match(username CITEXT, password TEXT)
    RETURNS BOOLEAN
    LANGUAGE SQL
    SECURITY DEFINER
    AS $$
      SELECT exists(
        SELECT *
          FROM app.users
          WHERE username = do_credentials_match.username
            AND password = crypt(do_credentials_match.password, password)
      );
    $$;

  GRANT EXECUTE ON FUNCTION auth.do_credentials_match TO hp_anon, hp_api;

  CREATE OR REPLACE FUNCTION auth.authenticate()
    RETURNS VOID
    LANGUAGE PLPGSQL
    AS $$
      DECLARE
        session_user_id BIGINT;
        session_role TEXT;
      BEGIN
        SELECT current_setting('claims.user_id', true)
          INTO session_user_id;

        -- If there's a user ID in claims, then it's assumed that the person
        -- is logged in. So, we set the role (only for the lifetime of the
        -- transaction) as `hp_user`. Otherwise if it doesn't exist, then it is
        -- assumed to be an anonymous user.
        IF session_user_id IS NOT NULL THEN
          SET LOCAL ROLE hp_user;

          PERFORM set_config('auth.user_id', session_user_id :: TEXT, true);
        ELSE
          SET LOCAL ROLE hp_anon;

          PERFORM set_config('auth.user_id', '', true);
        END IF;
      END;
    $$;

    COMMENT ON FUNCTION auth.authenticate IS
      'Sets the role as LOCAL, and the user_id in current_setting.';

    GRANT EXECUTE ON FUNCTION auth.authenticate TO hp_anon;

COMMIT;
