import { useCallback, useEffect, useState } from 'react'
import { useEventListener } from 'usehooks-ts'

type UseCookieOptions<T> = {
  deserializer?: (value: string) => T
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === 'undefined'

export function useCookie<T>(
  name: string,
  initialValue: T | (() => T),
  options: UseCookieOptions<T> = {},
): T {
  const { initializeWithValue = true } = options

  const deserializer = useCallback<(value: string) => T>(
    value => {
      if (options.deserializer) {
        return options.deserializer(value)
      }

      // Support 'undefined' as a value
      if (value === 'undefined') {
        return undefined as unknown as T
      }

      const defaultValue =
        initialValue instanceof Function ? initialValue() : initialValue

      // For simple string values, return as-is
      if (typeof defaultValue === 'string') {
        return value as unknown as T
      }

      // Try to parse JSON for complex types
      let parsed: unknown
      try {
        parsed = JSON.parse(value)
      } catch (error) {
        console.error('Error parsing cookie JSON:', error)
        return defaultValue
      }

      return parsed as T
    },
    [options, initialValue],
  )

  const getCookie = useCallback((cookieName: string): string | null => {
    if (IS_SERVER) {
      return null
    }

    const nameEQ = cookieName + '='
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }, [])

  const readValue = useCallback((): T => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue

    if (IS_SERVER) {
      return initialValueToUse
    }

    try {
      const cookieValue = getCookie(name)
      return cookieValue ? deserializer(cookieValue) : initialValueToUse
    } catch (error) {
      console.warn(`Error reading cookie "${name}":`, error)
      return initialValueToUse
    }
  }, [initialValue, name, deserializer, getCookie])

  const [value, setValue] = useState(() => {
    if (initializeWithValue) {
      return readValue()
    }

    return initialValue instanceof Function ? initialValue() : initialValue
  })

  useEffect(() => {
    setValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  // Listen for storage events (in case cookies are modified by other tabs)
  const handleStorageChange = useCallback(() => {
    setValue(readValue())
  }, [readValue])

  useEventListener('storage', handleStorageChange)

  return value
}
