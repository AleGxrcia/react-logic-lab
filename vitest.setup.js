import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Reset window.matchMedia before each test to prevent test pollution
beforeEach(() => {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })
})
