# Config

Create a root file `config.json`.

Example local config:

```json
{
  "app": {
    "url": "http://localhost:3000",
    "port": 3000
  },
  "auth": {
    "clients": [
      {
        "name": "local",
        "token": "LOCAL-TEST-AUTH-KEY"
      }
    ]
  }
}
```

# Authorization

Files are stored per client.

All requests must include headers:

```js
headers: {
  Authorization: `${client} ${token}`,
}
```

## Upload a file

POST request to `/u` with FormData headers and body.

## Upload a file from an URL

POST request to `/dl` with body:

```typescript
Array<{
  url: string
  filename: string
}>
```

## Get all files

GET request to `/f`.

## Get a single file

GET request to `/f/...` with the filename.

Example: `https://cdn.example.com/f/joy.png`

## Delete a file

DELETE request to `/f/...` with the filename.

Example: `https://cdn.example.com/f/joy.png`

## Delete all files

DELETE request to `/f`.
