# QuarryFlow

A business management app for a sand truck/quarry supply business. This application helps manage customers, sales, expenses, and provides key business insights through a clean and intuitive dashboard.

## Getting Started

This is a Next.js project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
```

Open your browser to see the result.

## Important: Enable Google Sign-In

To use Google Authentication in this application, you must enable the Google Sign-In provider in your Firebase project.

1.  **Go to the Firebase Console**: Navigate to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2.  **Go to Authentication**: In the left-hand menu, click on **Authentication**.
3.  **Go to the "Sign-in method" tab**.
4.  **Enable Google**: Click on **Google** from the list of sign-in providers and toggle the **Enable** switch.
5.  **Add Authorized Domain**:
    *   Still in the Authentication -> "Sign-in method" tab, scroll down to the **Authorized domains** section.
    *   Click **Add domain** and enter the domain where your application is running (e.g., `localhost` for local development or your deployed app's domain).
6.  **Save** your changes.

After completing these steps, the Google Sign-In feature in the app will work correctly.
