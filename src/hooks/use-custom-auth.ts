import { useCookie } from "./use-cookie"

type SessionData = {
  id?: string
  email?: string
  name?: string
  picture?: string
}

export const AUTH_COOKIE_NAME = 't4chat.csgo'
export const useCustomAuth = () => {
  const session = useCookie<SessionData>(AUTH_COOKIE_NAME, {})
  const isAuthenticated = !!session.id
  return { isAuthenticated, session }
}
