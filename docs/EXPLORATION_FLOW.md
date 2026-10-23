# Knowledge Exploration Flow

## Purpose

The knowledge graph is both the primary search interface
and a persistent visual record of a visitor's curiosity.

## 1. Searching

- A visitor enters a concept or question.
- The system matches it to an approved concept.
- The concept appears in a two-dimensional semantic space.
- Related concepts are represented by directional vectors.
- Clicking a concept/vector target opens its concept page.

## 2. Reading a concept

Concept pages may contain interactive words and phrases.

Visitors can select related concepts while reading without
immediately leaving the current page.

The system tracks deliberate selections, not passive
scrolling or text visibility.

## 3. Returning to the graph

When the visitor returns:

- Restore the previous graph and camera position.
- Preserve already discovered nodes.
- Add deliberately selected concepts.
- Reveal relationship vectors between concepts.
- Animate newly discovered connections into view.

## 4. Automatic suggestions

If the visitor selected no concepts while reading:

- Find exactly three nearby eligible concepts.
- Exclude concepts already displayed where possible.
- Prefer meaningful, approved relationships.
- Display suggestions using dotted vectors.
- Do not mark suggestions as visited.
- If fewer than three eligible concepts exist, display
  only the available suggestions.

## 5. Semantic positioning

The graph uses a hidden two-dimensional coordinate plane.

Concept placement should preserve meaningful relationships
and maintain stable positions across navigation.

Relationship styles distinguish:

- Direct connections
- Oppositional relationships
- Indirect connections
- Unexplored suggestions

The interface must not imply that all semantic relationships
are physically or mathematically equivalent.

## 6. Visitor history

Track separately:

- Visited concepts
- Selected concepts
- Suggested concepts
- Graph positions and camera state
- Exploration events

Anonymous visitors may open up to five distinct permitted
concept pages per session.

Suggestions and word selections do not consume this limit
until the corresponding concept page is opened.

Registered users may save exploration paths according to
their consent preferences.

## 7. Security and privacy

All concept content must pass server-side authorization
before being returned to the visitor.

Private research must not appear in public search results,
suggestions, API responses, or AI-generated explanations.

Anonymous exploration state must have an appropriate
retention policy and must not be treated as a secure identity.

## Initial Implementation

The first prototype will use curated concept data and
deterministic relationships.

Semantic AI matching and automatic vector positioning
will be added only after the basic interaction works.
