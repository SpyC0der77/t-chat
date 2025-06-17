import { useCookie } from "./use-cookie"

type SessionData = {
  userId?: string
  email?: string
  name?: string
  picture?: string
}

const AUTH_COOKIE_NAME = 'csgo'
export const useCustomAuth = () => {
  const session = useCookie<SessionData>(AUTH_COOKIE_NAME, {})
  const isAuthenticated = !!session.userId
  return { isAuthenticated, session }
}
