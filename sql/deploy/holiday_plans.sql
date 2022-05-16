-- Deploy holiplan:holiday_plans to pg

BEGIN;

CREATE SCHEMA app;

CREATE TABLE app.plans(
  plan_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  date        DATE NOT NULL
);

CREATE TABLE app.events(
  event_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id    UUID REFERENCES app.plans(plan_id) ON DELETE CASCADE,

  name       TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date   TIMESTAMP NOT NULL,

  -- Checks if the end_date happens after the start_date.
  CONSTRAINT valid_timestamp CHECK (start_date < end_date),
  CONSTRAINT same_day CHECK (start_date::DATE = end_date::DATE),

  -- Checks if those events with the same `plan_id`s should not have any
  -- overlapping date/time ranges.
  EXCLUDE USING gist (
    plan_id gist_uuid_ops WITH =,
    tsrange(start_date, end_date) WITH &&
  )
);

CREATE INDEX event_plan_index ON app.events(plan_id);

--------------------------------------------------------------------------------
-- Plan-related functions

CREATE OR REPLACE FUNCTION app.create_plan
  ( in_name TEXT
  , in_description TEXT
  , in_plan_date DATE
  )
  RETURNS JSONB
  LANGUAGE SQL
  AS $$
    INSERT
      INTO app.plans (name, description, date)
      VALUES ($1, $2, $3)
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
          );
  $$;

CREATE OR REPLACE FUNCTION app.get_plan_details(in_plan_id UUID)
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

-- TODO: Add user ID in argument
CREATE OR REPLACE FUNCTION app.list_plans()
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

CREATE OR REPLACE FUNCTION app.edit_plan
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
      RETURNING app.get_plan_details(plan_id)
  $$;

CREATE OR REPLACE FUNCTION app.delete_plan(in_plan_id UUID)
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

--------------------------------------------------------------------------------
-- Event-related functions
CREATE OR REPLACE FUNCTION app.create_event
  ( in_plan_id UUID
  , in_name TEXT
  , in_start_date TIMESTAMP
  , in_end_date TIMESTAMP
  )
  RETURNS JSONB
  LANGUAGE SQL
  AS $$
    INSERT
      INTO app.events (plan_id, name, start_date, end_date)
      SELECT plan_id, $2, $3, $4
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
          );
  $$;

CREATE OR REPLACE FUNCTION app.edit_event
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

CREATE OR REPLACE FUNCTION app.delete_event(event_id UUID)
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

COMMIT;
