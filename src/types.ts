export interface AuthClient {
  name: string
  token: string
}

export interface Config {
  app: {
    url: string
    port: number
  }
  auth: {
    clients: AuthClient[]
  }
}

export interface RequestAuth {
  client: string
  token: string
}

export interface FileResponse {
  filename: string
  url: string
}
