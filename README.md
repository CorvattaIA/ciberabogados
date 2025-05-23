# Ciberabogados

Ciberabogados is a legal tech platform designed to empower users with tools for self-assessment of their legal situations through a diagnostic test and an AI-powered chat assistant for initial guidance.

## Key Features

*   **Diagnostic Test**: Users can take a test to assess their situation across various legal areas.
*   **AI Legal Chat**: An AI assistant provides information and guidance based on user queries and diagnostic test context.
*   **(Future) User Dashboard**: A personalized space for users to track their tests, chats, and documents.
*   **(Future) Appointment Booking**: Functionality to schedule consultations with legal experts.

<!-- Add screenshots/GIFs of the interface here -->

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS
*   **Backend**: Supabase (Authentication, Database, Storage)
*   **AI**: Placeholder for AI API integration (currently mocked)

## Project Structure Overview

*   `/frontend`: Contains the React application (Vite + Tailwind CSS).
*   `/supabase`: Includes database schema migrations and RLS policies for Supabase.
*   `/docs`: Project documentation files.

## Prerequisites

*   Node.js (v18.x or higher recommended)
*   npm (v9.x or higher recommended) or yarn

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://your-repository-url/ciberabogados.git
    cd ciberabogados
    ```

2.  **Navigate to the frontend application**:
    ```bash
    cd frontend
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```
    (or `npm ci` for cleaner installs based on `package-lock.json`)

4.  **Environment Variables**:
    *   Copy the `.env.example` file in the `/frontend` directory to a new file named `.env` (or `.env.local`).
        ```bash
        cp .env.example .env
        ```
    *   Fill in your Supabase project URL and public anon key. You can get these from your Supabase project dashboard:
        1.  Go to your Supabase project.
        2.  Navigate to "Project Settings" > "API".
        3.  Find your "Project URL" and "anon" "public" key.
    *   Fill in any AI API keys if you are integrating a live AI service.

## Development Scripts

All commands should be run from the `/frontend` directory:

*   **Start the development server**:
    ```bash
    npm run dev
    ```
*   **Build the application for production**:
    ```bash
    npm run build
    ```
*   **Preview the production build locally**:
    ```bash
    npm run preview
    ```
*   **Lint the codebase**:
    ```bash
    npm run lint
    ```
*   **Format the code with Prettier**:
    ```bash
    npm run format
    ```

## Supabase Setup

The database schema migrations are located in the `/supabase/migrations` directory. These should be applied to your Supabase project using the Supabase CLI or by running the SQL directly in the Supabase dashboard SQL editor.

Ensure you have the Supabase CLI installed and configured if you prefer CLI-based migrations:
```bash
# Example: Apply migrations using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push # Or manage migrations individually
```

## Contribution Guide

<!-- See /docs/CONTRIBUTING.md for contribution guidelines. -->
Details on how to contribute to the Ciberabogados project will be provided in a dedicated `CONTRIBUTING.md` file. (Currently a placeholder)

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
