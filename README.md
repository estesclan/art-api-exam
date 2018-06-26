# Art API

An api to manage paintings.

## Getting Started

This section is intended for software developers. If you have rights to the repo, simply clone. If not, you may fork and clone the repo.

After you fork, clone, and install dependencies:

```
git clone <clone url>
cd art-api-exam
npm install
```

## Environment Variables

You'll need to create a local **.env** file to store your application's secrets and other configuration values. Follow these steps to generate and store the secrets.

1.  `PORT` - Create a `PORT` environment variable. Set the value to an unused port number for your machine.
2.  `COUCH_HOSTNAME=https://{user}:{pwd}@{dbhostname}/`
3.  `COUCH_DBNAME=paintings`

**.env** file example:

```
PORT=5000
COUCH_HOSTNAME=OUCH_HOSTNAME=https://admin:Password@peterestes.jrscode.cloud/
COUCH_DBNAME=paintings
```

## Load some test data

Optionally, you can load some test data in your CouchDB database by running `npm run load`. This will take the array of document within **load-data.js** and bulk add them into the database.

```
npm run load
```

## Start the api

Run the following command to start the api on the designated port.

```
npm start
```

## Endpoints

This api allows you to create, read, update, delete and list paintings.

## Create a painting - `POST /paintings`

Add a painting to the collection paintings by providing a new painting resource in the request body.

The `name`, `movement`, `artist`, `yearCreated` and `museum` properties are required.

**Example**

```
POST /paintings

{
  _id: "painting_starry_night",
  name: "The Starry Night",
  type: "painting",
  movement: "post-impressionism",
  artist: "Vincent van Gogh",
  yearCreated: 1889,
  museum: { name: "Museum of Modern Art", location: "New York" }
}
```

### Response 200 OK

Returned when the operation successfully add the painting.

```
{
  "ok": true,
  "id": "painting_starry_night",
  "rev": "1-A6157A5EA545C99B00FF904EEF05FD9F"
}
```

### Response 400 Bad request

Returned when the supplied request body is missing or if required fields are missing.

### Response 404 Not Found

The requested resource could not be found. You may be trying to access a record that does not exist, or you may have supplied an invalid URL.

### Response 500 Internal Server Error

An unexpected error has occurred on our side. You should never receive this response, but if you do please let us know and we'll fix it.

## Get a single painting by id - `GET /painting/:paintingID`

Retrieve a single painting resource from the collection of paintings. Use the id to identify a single painting.

**Example**

```
GET /paingings/painting_starry_night

{
  _id: "painting_starry_night",
  name: "The Starry Night",
  type: "painting",
  movement: "post-impressionism",
  artist: "Vincent van Gogh",
  yearCreated: 1889,
  museum: { name: "Museum of Modern Art", location: "New York" }
}
```

### Response 200 OK

Returned when the operation successfully retrieves the painting.

## Update a painting - `PUT /paintings/:id`

Edits a painting. Provide the `id` in the path to identify the painting. Provide the updated painting in the body of the request.

### Request body

An object representing the painting to edit.

**Example**

Update the movement of the painting to "impressionism".

```
PUT /paintings/painting_starry_night

{
  _id: "painting_starry_night",
  name: "The Starry Night",
  type: "painting",
  movement: "impressionism",
  artist: "Vincent van Gogh",
  yearCreated: 1889,
  museum: { name: "Museum of Modern Art", location: "New York" }
}
```
