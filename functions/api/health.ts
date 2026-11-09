type Env = {
  APP_ENV?: string
  ASSETS: { fetch: (input: string) => Promise<Response> }
}

type BuildInfo = { version?: string; commit?: string }

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  let build: BuildInfo = {}
  try {
    const res = await env.ASSETS.fetch(new URL('/version.json', request.url).toString())
    if (res.ok) build = (await res.json()) as BuildInfo
  } catch {
    // version.json is absent in local dev
  }
  return Response.json({
    status: 'ok',
    env: env.APP_ENV ?? 'local',
    version: build.version ?? 'local',
    commit: build.commit ?? 'local',
  })
}
