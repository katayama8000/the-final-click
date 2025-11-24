# The Final Click

## Project Overview

"The Final Click" is an engaging web application where users worldwide collaborate in real-time to reach a monumental goal: **100 million clicks**. The person who registers the very last click wins a grand prize of $500!

This app is designed to be highly interactive and motivating, encouraging users to click their way to the ultimate goal.

## Features

-   **Real-time Click Counter**: Watch the clicks increase live as users from all over the globe contribute.
-   **Dynamic Progress Bar**: A visual indicator at the top of the screen shows the current progress towards the 100 million click goal.
-   **Interactive Click Effects**: Enjoy satisfying visual feedback with every click, including a "punch" effect on the button and "+1" particles floating away.
-   **Confetti Celebration**: A shower of confetti erupts when the 100 million click goal is finally reached.
-   **Winner Collection Modal**: The final clicker will be prompted to enter their email address to claim their $500 prize.
-   **Loading Indicator**: Ensures a smooth user experience by displaying a spinner while fetching initial data.

## Tech Stack

-   **Framework**: Next.js (React)
-   **Database**: Firebase Realtime Database
-   **Language**: TypeScript

## Setup and Local Development

Follow these steps to get the project running on your local machine.

1.  **Clone the repository**:

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd the-final-click
    ```

2.  **Install dependencies**:

    ```bash
    yarn install
    ```

3.  **Firebase Project Setup**:
    *   Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    *   Add a web app to your Firebase project and copy the `firebaseConfig` object.
    *   Enable **Realtime Database** for your project.

4.  **Create `.env` file**:
    *   In the root of your project, create a file named `.env`.
    *   Populate it with your Firebase configuration. Ensure you use the `NEXT_PUBLIC_` prefix for client-side accessible variables.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
    ```

## Deploy to Firebase Hosting
```bash
firebase experiments:enable webframeworks
```

```bash
firebase init --hosting
```

```bash
firebase deploy
```