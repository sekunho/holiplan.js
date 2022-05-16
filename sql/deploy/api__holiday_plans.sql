-- Deploy holiplan:api__holiday_plans to pg

BEGIN;

  SET LOCAL ROLE hp_api;

  --------------------------------------------------------------------------------
  -- Plan-related functions

  CREATE OR REPLACE FUNCTION api.create_plan
    ( in_name TEXT
    , in_description TEXT
    , in_plan_date DATE
    )
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      INSERT
        INTO app.plans (name, description, date, user_id)
        VALUES ($1, $2, $3, app.current_user_id())
        RETURNING
          json_build_object
            ( 'id'
            , plan_id
            , 'name'
            , name
            , 'description'
            , description
            , 'date'
            , date
            , 'user_id'
            , user_id
            );
    $$;

  GRANT EXECUTE ON FUNCTION api.create_plan TO hp_user;

  CREATE OR REPLACE FUNCTION api.get_plan_details(in_plan_id UUID)
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      SELECT
        json_build_object
          ( 'name'
          , plans.name
          , 'description'
          , plans.description
          , 'events'
          , coalesce
              ( jsonb_agg(row_to_json(events)
                  ORDER BY events.start_date ASC)
                  FILTER (WHERE event_id IS NOT NULL)
              , '[]'::JSONB
              )
          )
        FROM app.plans
        LEFT JOIN app.events
        ON plans.plan_id = events.plan_id
        WHERE plans.plan_id = in_plan_id
        GROUP BY plans.name, plans.description;
    $$;

  GRANT EXECUTE ON FUNCTION api.get_plan_details TO hp_user;

  -- TODO: Add user ID in argument
  CREATE OR REPLACE FUNCTION api.list_plans()
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      SELECT
        json_build_object
          ( 'data'
          , coalesce(jsonb_agg(row_to_json(plans)), '[]'::JSONB)
          , 'length'
          , count(plans)
          )
        FROM app.plans;
    $$;

  GRANT EXECUTE ON FUNCTION api.list_plans TO hp_user;

  CREATE OR REPLACE FUNCTION api.edit_plan
    ( in_plan_id UUID
    , in_name TEXT
    , in_description TEXT
    )
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      UPDATE app.plans
        SET name = in_name
          , description = in_description
        WHERE plans.plan_id = in_plan_id
        RETURNING api.get_plan_details(plan_id)
    $$;

  GRANT EXECUTE ON FUNCTION api.edit_plan TO hp_user;

  CREATE OR REPLACE FUNCTION api.delete_plan(in_plan_id UUID)
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      DELETE
        FROM app.plans
        WHERE plans.plan_id = $1
        RETURNING json_build_object
          ( 'id'
          , plan_id
          , 'name'
          , name
          , 'description'
          , description
          )
    $$;

  GRANT EXECUTE ON FUNCTION api.delete_plan TO hp_user;

  --------------------------------------------------------------------------------
  -- Event-related functions
  CREATE OR REPLACE FUNCTION api.create_event
    ( in_plan_id UUID
    , in_name TEXT
    , in_start_date TIMESTAMP
    , in_end_date TIMESTAMP
    )
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      INSERT
        INTO app.events (plan_id, name, start_date, end_date, user_id)
        SELECT plan_id, $2, $3, $4, app.current_user_id()
          FROM app.plans
          WHERE plans.plan_id = $1
            AND plans.date = $3 :: DATE
        RETURNING
          json_build_object
            ( 'id'
            , event_id
            , 'plan_id'
            , plan_id
            , 'start_time'
            , start_date
            , 'end_time'
            , end_date
            , 'user_id'
            , user_id
            );
    $$;

  GRANT EXECUTE ON FUNCTION api.create_event TO hp_user;

  CREATE OR REPLACE FUNCTION api.edit_event
    ( event_id UUID
    , name TEXT
    , start_date TIMESTAMP
    , end_date TIMESTAMP
    )
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      UPDATE app.events
        SET name = $2
          , start_date = $3
          , end_date = $4
        WHERE events.event_id = $1
        RETURNING
          json_build_object
            ( 'id'
            , event_id
            , 'plan_id'
            , plan_id
            , 'start_time'
            , start_date
            , 'end_time'
            , end_date
            );
    $$;

  GRANT EXECUTE ON FUNCTION api.edit_event TO hp_user;

  CREATE OR REPLACE FUNCTION api.delete_event(event_id UUID)
    RETURNS JSONB
    LANGUAGE SQL
    AS $$
      DELETE
        FROM app.events
        WHERE event_id = $1
        RETURNING
          json_build_object
            ( 'id'
            , event_id
            , 'plan_id'
            , plan_id
            , 'name'
            , name
            , 'start_time'
            , start_date
            , 'end_time'
            , end_date
            )
    $$;

  GRANT EXECUTE ON FUNCTION api.delete_event TO hp_user;

COMMIT;
