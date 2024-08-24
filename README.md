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

Example: `https://cdn.arnoldsk.lv/f/joy.png`

## Delete a file

DELETE request to `/f/...` with the filename.

Example: `https://cdn.arnoldsk.lv/f/joy.png`

## Delete all files

DELETE request to `/f`.
