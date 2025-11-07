declare module '@google/genai' {
  // Minimal stub types to satisfy TypeScript during build.
  export interface GenerateContentResponse {
    text: string
    // add other fields if the real package returns more
  }

  export interface ModelsApi {
    generateContent(opts: { model: string; contents: string; config?: any }): Promise<GenerateContentResponse>
  }

  export class GoogleGenAI {
    constructor(opts: { apiKey?: string })
    models: ModelsApi
  }

  export default GoogleGenAI
}

  // Stubs for Vite used by files under `frontend_ideas` so the Next.js
  // type checker doesn't fail on dev-tooling files that are not part of
  // the Next runtime.
  declare module 'vite' {
    export function defineConfig(cfg: any): any
    // Accept any args; this is a dev-tooling helper and we only need a loose stub
    export function loadEnv(...args: any[]): any
  }

  declare module '@vitejs/plugin-react' {
    const plugin: any
    export default plugin
  }
