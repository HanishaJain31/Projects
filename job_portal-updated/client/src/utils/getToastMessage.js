export default function getToastMessage(payload, fallback) {
  if (!payload) return fallback
  if (typeof payload === 'string') return payload
  if (typeof payload.message === 'string') return payload.message
  if (typeof payload.error === 'string') return payload.error
  if (typeof payload.message?.keyword === 'string') return payload.message.keyword
  if (typeof payload.message?.message === 'string') return payload.message.message
  return fallback
}
