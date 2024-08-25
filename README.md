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

Private requests must include auth headers:

```js
headers: {
  Authorization: `${client} ${token}`,
}
```

# Requests

Files are stored per client.

### Upload a file

> Private request

POST request to `/u` with FormData headers and body.

Response:

```json
{
  "filename": "joy.png",
  "url:" "https://hosting.example.com/f/local/joy.png"
}
```

### Upload a file from an URL

> Private request

POST request to `/dl`.

Example body:

```json
[
  {
    "filename": "joy.png",
    "url:" "https://someremotesite.com/image.png"
  },
]
```

Response:

```json
[
  {
    "filename": "joy.png",
    "url:" "https://hosting.example.com/f/local/joy.png"
  },
]
```

### Get all file data

> Private request

GET request to `/f`.

Response:

```json
[
  {
    "filename": "joy.png",
    "url:" "https://hosting.example.com/f/local/joy.png"
  },
]
```

### Get a single file data

> Private request

GET request to `/f/:filename`.

Example: `https://hosting.example.com/f/joy.png`

Response:

```json
{
  "filename": "joy.png",
  "url:" "https://hosting.example.com/f/local/joy.png"
}
```

### View a single file

> Public request

GET request to `/f/:client/:filename`.

Example: `https://hosting.example.com/v/local/joy.png`

Response:

```
🖼️
```

### Delete a file

> Private request

DELETE request to `/f/:filename`.

Example: `https://hosting.example.com/f/joy.png`

Response:

```

```

### Delete all files

> Private request

DELETE request to `/f`.

Response:

```

```
