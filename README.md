# holiplan

It's a todo list except for the holidays. This is just the back-end part of it,
and I don't plan to make a client for it anytime soon.

## Features

- User sessions via JWT (yeah, I know)
- Manage your holiday plans
- Manage your events/todos in each holiday plan
- Note down your plans with comments

## Getting Started

For the dev environment, it's fairly simple to set up the project if you're
already using Nix (with Flakes). If not, then you'll need to get the dependencies
yourself; sorry!

### Pre-requisites

- You'll need to setup PostgreSQL (14.2).
- You'll also need [`holidapi`](https://github.com/sekunho/holidapi). You can
check out the setup instructions there.

### Running the project

```sh
# In project root

## Run schema migrations
sqitch deploy

## Install dependencies
npm install

## Run the server
HPSECRET=some_secret \
  HOLIDAPI_BASE_URL=http://localhost:4000/api \
  PGUSER=hp_authenticator \
  PGHOST=localhost \
  PGPORT=5432 \
  PGDATABASE=holiplan \
  npm start
```

## Examples

### Register an account

Request

```
curl --request POST \
  --url http://localhost:3000/api/register \
  --header 'Content-Type: application/json' \
  --cookie token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NTI5NjgyMjZ9.CE45RRDIPNYtok-alqJqVHFBTd3Z6HZXsnUqM99rFyY \
  --data '{
  "username": "steve",
  "password": "hunter2"
}'
```

Response

```
OK
```

Registering will create a cookie with a JWT in the response. So you don't have
to manually login.

Anything a user makes will be associated to their user ID based on the claims
derived from the JWT.

### Create a new holiday plan based on a holiday in Great Britain

Request

```
curl --request POST \
  --url http://localhost:3000/api/plans \
  --header 'Content-Type: application/json' \
  --cookie token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NTI5NjgyMjZ9.CE45RRDIPNYtok-alqJqVHFBTd3Z6HZXsnUqM99rFyY \
  --data '{
  "name": "Bob'\''s Birthday Bash!",
  "description": "It is my brithday!",
  "date": "2022-04-15",
  "holiday_id": "gb-2022-f0e5acae3e49404548844496dc99554e",
  "country": "gb"
}'
```

Response

```
{
  "id": "75cb6788-e4f5-4dcd-bdbd-904fc8b05de7",
  "date": "2022-04-15",
  "name": "Bob's Birthday Bash!",
  "country": "gb",
  "user_id": 1,
  "holiday_id": "gb-2022-f0e5acae3e49404548844496dc99554e",
  "description": "It is my brithday!"
}
```

### Create an event in a plan

Request

```
curl --request POST \
  --url http://localhost:3000/api/plans/75cb6788-e4f5-4dcd-bdbd-904fc8b05de7/events \
  --header 'Content-Type: application/json' \
  --cookie token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NTI5NjgyMjZ9.CE45RRDIPNYtok-alqJqVHFBTd3Z6HZXsnUqM99rFyY \
  --data '{
  "name": "Prepare food",
  "start_date": "2022-04-15 01:00:00",
  "end_date": "2022-04-15 02:00:00"
}'
```

Response

```
{
  "id": "52b55b9e-0231-443a-b998-c271ff83a897",
  "plan_id": "75cb6788-e4f5-4dcd-bdbd-904fc8b05de7",
  "user_id": 1,
  "end_time": "2022-04-15T02:00:00",
  "start_time": "2022-04-15T01:00:00"
}
```

If ever you get an error saying `Resource not found`, check the ff:

1. That the plan ID exists
2. That the user owns that plan
3. That the time range has the same date as the plan's date.

### Comment on a plan

Request

```
curl --request POST \
  --url http://localhost:3000/api/plans/75cb6788-e4f5-4dcd-bdbd-904fc8b05de7/comments \
  --header 'Content-Type: application/json' \
  --cookie token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NTI5NjgyMjZ9.CE45RRDIPNYtok-alqJqVHFBTd3Z6HZXsnUqM99rFyY \
  --data '{
  "content": "I should probably ask Bob if he wants a special kind of cake."
}'
```

Response

```
{
  "id": "5a8c1a24-d39f-4343-b459-7c40081f267e",
  "content": "I should probably ask Bob if he wants a special kind of cake.",
  "plan_id": "75cb6788-e4f5-4dcd-bdbd-904fc8b05de7",
  "user_id": 1
}
```

### Get plan details

Request

```
curl --request GET \
  --url http://localhost:3000/api/plans/75cb6788-e4f5-4dcd-bdbd-904fc8b05de7 \
  --cookie token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NTI5NjgyMjZ9.CE45RRDIPNYtok-alqJqVHFBTd3Z6HZXsnUqM99rFyY
```

Response

```
{
  "id": "75cb6788-e4f5-4dcd-bdbd-904fc8b05de7",
  "date": "2022-04-15",
  "name": "Bob's Birthday Bash!",
  "events": [
    {
      "name": "Prepare food",
      "plan_id": "75cb6788-e4f5-4dcd-bdbd-904fc8b05de7",
      "user_id": 1,
      "end_date": "2022-04-15T02:00:00",
      "event_id": "52b55b9e-0231-443a-b998-c271ff83a897",
      "start_date": "2022-04-15T01:00:00"
    }
  ],
  "country": "gb",
  "comments": [
    {
      "content": "I should probably ask Bob if he wants a special kind of cake.",
      "plan_id": "75cb6788-e4f5-4dcd-bdbd-904fc8b05de7",
      "user_id": 1,
      "comment_id": "5a8c1a24-d39f-4343-b459-7c40081f267e"
    }
  ],
  "holiday_id": "gb-2022-f0e5acae3e49404548844496dc99554e",
  "description": "It is my brithday!",
  "holiday": {
    "date": "2022-04-15",
    "informal?": false,
    "name": "Good Friday",
    "observed_date": "2022-04-15",
    "raw_date": "2022-04-15",
    "uid": "gb-2022-f0e5acae3e49404548844496dc99554e"
  }
}
```

There are other endpoints, and if you want to try it all out, then you can try
importing the `api-spec.json` to Insomnia.
