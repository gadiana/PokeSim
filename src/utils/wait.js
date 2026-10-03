// Promise-based delay used by the battle flows to sequence animations and messages.

export const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
