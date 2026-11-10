export type Health = { env: string; version: string; commit: string }

export function formatBuildInfo(h: Health): string {
  const version = h.version === 'local' ? 'local build' : `v${h.version.split('+')[0]}`
  const sha = h.commit === 'local' ? '' : ` · ${h.commit.slice(0, 7)}`
  return `${version}${sha} · ${h.env.toUpperCase()}`
}
