const { Pool } = require('pg');

const pool = new Pool();

/* This module contains all the things necessary to talk to the DB including
 * some convenience functions. Note that you *have* to connect to the database
 * as the `hp_authenticator` role. Since that's the entrypoint role that can
 * switch to `hp_anon` or `hp_user`, and nothing else. Its permissions are locked
 * down. Connecting to the database as any user with any elevated permissions will
 * be problematic. Like, really problematic. */
db = {
  /* Use this query when you want to check if the user is authenticated. Really,
   * this should be named authorization but whatever. */
  authenticate_query: async (user_id, query, query_args) => {
    const client = await pool.connect();
    const set_role_query = 'SET LOCAL ROLE hp_anon';
    const set_config_query = 'SELECT set_config(\'claims.user_id\', $1::TEXT, true)';
    const authenticate_query = 'SELECT auth.authenticate()';

    try {
      await client.query('BEGIN');
      await client.query(set_role_query);

      if (user_id != null) {
        await client.query(set_config_query, [user_id]);
      }

      await client.query(authenticate_query);

      const res = await client.query(query, query_args);

      await client.query('COMMIT');

      return res;
    } catch(e) {
      await client.query('ROLLBACK') ;
      throw e
    } finally {
      client.release();
    }
  },
  /// Use this for anything else that doesn't need authorization.
  query: async (query, query_args) => {
    const client = await pool.connect();
    const set_role_query = 'SET LOCAL ROLE hp_anon';

    try {
      await client.query('BEGIN');
      await client.query(set_role_query);
      const res = client.query(query, query_args);
      await client.query('END');

      return res;
    } catch(e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

module.exports = db;
