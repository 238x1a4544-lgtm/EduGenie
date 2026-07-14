# EduGenie — AI-Powered Learning Assistant

## Documentation

---

## 1. Overview

**EduGenie** is a lightweight, AI-powered educational assistant designed to simplify and enhance the learning experience through the power of Generative AI. It is built for students, self-learners, and educators who need fast, accurate, and personalized academic support.

EduGenie combines the capabilities of lightweight local models and cloud-based AI services to deliver quick and accurate educational assistance, with an architecture optimized to run efficiently even on resource-constrained devices such as the Mac M1.

The platform's core mission is to make learning more **interactive, accessible, and efficient** for users across different academic levels and subject domains.

---

## 2. Key Features

| Feature | Description |
|---|---|
| **Intelligent Question Answering** | Provides instant, accurate answers to academic questions with additional educational context. |
| **Simplified Concept Explanations** | Breaks down complex topics into easy-to-understand explanations. |
| **AI-Powered Quiz Generation** | Automatically generates topic-specific quizzes for self-assessment. |
| **Educational Text Summarization** | Condenses long study material into concise, digestible summaries. |
| **Personalized Learning Path Recommendations** | Builds structured, progressive roadmaps (beginner → advanced) for a given topic. |
| **Interactive & User-Friendly Interface** | A responsive web interface for a smooth learning experience. |

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | FastAPI (Python) |
| Frontend | HTML + CSS (responsive design, CSS animations) |
| AI/ML | Generative AI, NLP, GeminiAI, AI/ML Inference |
| Prompting | Prompt Engineering techniques for structured AI outputs |
| Deployment Target | Lightweight, optimized for resource-constrained devices (e.g., Mac M1) |

**Skills / Technologies Involved:**
- Python
- FastAPI
- Generative Artificial Intelligence
- Natural Language Processing (NLP)
- HTML Editor / HTML Application
- Prompt Engineering
- CSS Animations
- GeminiAI
- AI/ML Inference

---

## 4. System Architecture (High-Level)

```
                ┌───────────────────────┐
                │      Frontend UI       │
                │   (HTML + CSS + JS)    │
                └───────────┬───────────┘
                            │  HTTP Requests
                            ▼
                ┌───────────────────────┐
                │     FastAPI Backend    │
                │  (Routes / Controllers)│
                └───────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
     ┌────────────┐ ┌───────────────┐ ┌────────────────┐
     │  Q&A Engine │ │ Quiz Generator │ │ Summarizer /    │
     │             │ │                │ │ Path Recommender│
     └──────┬──────┘ └───────┬───────┘ └────────┬────────┘
            │                │                    │
            └────────────────┼────────────────────┘
                              ▼
                 ┌─────────────────────────┐
                 │  Generative AI Service   │
                 │   (GeminiAI / Local LLM) │
                 └─────────────────────────┘
```

The backend receives a user request (question, topic, or document), routes it to the relevant module (Q&A, Quiz Generator, Summarizer, or Path Recommender), and constructs an optimized prompt sent to the underlying Generative AI model. The response is parsed and formatted before being returned to the frontend for display.

---

## 5. Core Modules

### 5.1 Intelligent Question Answering
- Accepts a natural language question from the user.
- Uses prompt engineering to query the AI model for a direct, accurate answer.
- Returns the answer along with supplementary educational context (e.g., related facts, definitions).

### 5.2 Concept Explanation Engine
- Takes a topic or concept as input.
- Simplifies the explanation based on the learner's implied academic level.
- Designed to make dense or technical subject matter approachable.

### 5.3 Quiz Generator
- Accepts a subject/topic (e.g., "Pythagoras Theorem").
- Generates a set of topic-specific questions for self-evaluation.
- Useful for reinforcing understanding after studying a concept.

### 5.4 Text Summarizer
- Accepts learning material (text/document) as input.
- Produces a concise, educational summary while retaining key concepts.

### 5.5 Personalized Learning Path Recommender
- Accepts a topic of interest (e.g., "SQL").
- Generates a structured roadmap spanning beginner, intermediate, and advanced stages.
- Includes study recommendations and progression guidance.

---

## 6. Usage Scenarios

**Scenario 1 — Question Answering**
> A student wants to learn about oceans and rivers and asks, *"Which is the largest ocean?"*
> EduGenie instantly provides an accurate answer along with additional educational context.

**Scenario 2 — Quiz Generation**
> A student studying the Pythagoras Theorem wants to assess their understanding. They select **"Generate Quiz"**, and EduGenie creates topic-specific questions for self-evaluation.

**Scenario 3 — Learning Path Generation**
> A learner interested in SQL requests a structured learning roadmap. EduGenie generates a personalized learning path covering beginner, intermediate, and advanced topics with study recommendations and progression guidance.

---

## 7. Project Status

- **Progress:** 0% (per project tracker)
- **Pending Action:** Team Lead needs to update and add the **Demo link** and **GitHub repository link** so the mentor can review and evaluate the project.

---

## 8. Target Users

- Students (school/college level)
- Self-learners exploring new subjects independently
- Educators looking for a supplementary teaching/assessment tool

---

## 9. Future Scope (Suggested)

> Not part of the original brief — included as optional forward-looking suggestions for the documentation.

- User authentication and saved learning history
- Multi-language support for explanations and quizzes
- Progress tracking and analytics dashboard
- Integration with external study material repositories
- Mobile-responsive PWA version

---

## 10. Appendix — Skills Required

- Python (Programming Language)
- FastAPI
- Generative Artificial Intelligence
- Natural Language Processing (NLP)
- HTML Editor
- Prompt Engineering
- HTML Application
- CSS Animations
- GeminiAI
- AI/ML Inference
