// FEATURE FLAG — AI meal assistant is OFFLINE pending review.
// Kept in its own module so the widget (and the heavy AI SDK it imports)
// can be code-split away from the initial bundle without importing it.
export const AI_ASSISTANT_ENABLED = false;
