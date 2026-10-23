# Personal Knowledge Atlas

**An interactive exploration of research, ideas, and the connections between them.**

**Status:** Early development / architectural planning

## Overview

Personal Knowledge Atlas is an interactive website designed to share and connect my academic research, technical projects, and personal investigations.

Rather than organizing information exclusively through traditional portfolio pages, the website allows visitors to begin with a concept, question, or idea and explore the relationships between different areas of knowledge.

My goal is to create a space where visitors can explore not just what I have worked on, but how I understand, derive, and connect ideas.

The project combines a personal knowledge base, an interactive concept graph, adaptive search, and a visitor feedback system.

## Core Idea

**What are you thinking about?**

The website begins with an open-ended search interface.

Visitors can enter a concept such as:

- The Sun
- Energy
- Wavefunctions
- Fourier transforms
- Quantum mechanics

The system attempts to identify the closest relevant concept within my knowledge base.

From there, visitors can explore connected ideas at different levels of complexity, including mathematical derivations, physical interpretations, related research, and open-ended questions.

Each concept serves as a possible starting point rather than a fixed destination.

## Planned Features

### 1. Interactive Knowledge Graph

Concepts are organized through relationships rather than exclusively through categories.

Each concept can contain:

- Explanations at different levels of difficulty
- Mathematical derivations
- Connections to other concepts
- Relevant projects and research
- References and supporting material
- Unresolved questions or areas for further investigation

Visitors can follow these relationships to develop their own exploration paths.

### 2. Adaptive Concept Search

The search system is intended to interpret visitor input and match it to relevant material.

Planned capabilities include:

- Keyword and semantic search
- Matching unfamiliar terms to related concepts
- Estimating topic complexity
- Selecting suitable introductory material
- Suggesting related concepts and questions

AI functionality will serve as a navigation and explanation tool, grounded in approved knowledge-base content.

### 3. Visitor Exploration

The website will support different access levels:

**Anonymous visitors**
- Access publicly published content
- Explore up to five distinct connected concept pages per anonymous session
- Preview the knowledge exploration experience

**Registered members**
- Access approved member content
- Continue exploring without the anonymous five-page restriction
- Save exploration history and concept paths
- Submit questions and challenges for review

**Administrator**
- Manage all published and unpublished content
- Review questions and research suggestions
- Manage member permissions
- Analyze aggregated exploration patterns
- Publish new concepts and connections

Registration does not automatically grant access to unpublished research.

### 4. Research Questions and Feedback

Visitors will eventually be able to submit questions, challenge explanations, and suggest new areas of investigation.

Submissions will enter a private review queue rather than being automatically incorporated into the knowledge base.

This allows visitor curiosity to help identify missing explanations, interesting connections, and potential research directions while preserving the distinction between my work and external contributions.

### 5. Privacy and Knowledge Ownership

This project emphasizes deliberate publication and controlled access.

- Only explicitly approved content is published.
- Public material represents a curated subset of the knowledge base.
- Private research remains separate from visitor-accessible content.
- Access permissions are enforced on the server.
- Visitor exploration history is handled according to their privacy preferences.
- User submissions are reviewed before being incorporated into the system.
- Private research is not intentionally supplied to public AI features or third-party model services.

The public-facing source code and the underlying research archive are treated as separate resources.

## Proposed Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack web application |
| React | Interactive user interface |
| TypeScript | Application development |
| PostgreSQL | Knowledge and visitor data |
| Prisma | Database access and schema management |
| Auth.js | Authentication and sessions |
| React Flow | Interactive concept visualization |
| pgvector | Potential future semantic concept matching |

The stack may evolve during development.

## Repository Structure

```text
personal-knowledge-website/
├── public/              # Public assets
├── src/
│   ├── app/             # Pages and API routes
│   ├── components/      # Shared UI components
│   ├── features/        # Application features
│   ├── lib/             # Database, auth, utilities
│   └── types/           # Shared TypeScript types
├── prisma/              # Database schema and migrations
├── docs/                # Design and architecture
├── tests/               # Automated tests
└── README.md
```

## Development Roadmap

- [ ] Set up application structure and development environment
- [ ] Design the initial concept database
- [ ] Create homepage and concept search interface
- [ ] Publish an initial curated set of concepts
- [ ] Implement concept relationships and navigation
- [ ] Add anonymous five-page exploration limits
- [ ] Implement authentication and account approval
- [ ] Add saved exploration paths
- [ ] Develop semantic search and AI-assisted explanations
- [ ] Create visitor question and feedback system
- [ ] Build private research management dashboard
- [ ] Implement additional privacy and anti-abuse protections

## Development Philosophy

This project is built around three ideas:

**Knowledge is connected.** Understanding a subject often requires exploring concepts across multiple fields rather than following a single predetermined sequence.

**Complexity should be approachable.** A visitor should be able to begin with a familiar idea and gradually reach more advanced material without losing the relationships that connect them.

**Curiosity should be reciprocal.** Visitors should have opportunities to explore my work, while their questions can help reveal gaps and inspire further investigation.

## Current Status

This project is in its initial development stage. The architecture, knowledge representation, visitor access model, and exploration experience are being developed incrementally.

Features described above represent the intended system and are not necessarily available in the current implementation.

## Author

Veronica Segovia

A personal research and software development project exploring the intersection of computer science, physics, and interactive knowledge representation.

## License and Content Usage

All rights reserved unless explicitly stated otherwise.

Source code, research notes, mathematical derivations, original explanations, and other published materials are not automatically licensed for reuse, redistribution, or machine-learning training.

Any third-party material remains subject to its original license or applicable terms.

Permission is required for reuse of original content beyond what is permitted by applicable law.
