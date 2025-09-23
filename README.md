# QuarryFlow

A business management app for a sand truck/quarry supply business. This application helps manage customers, sales, expenses, and provides key business insights through a clean and intuitive dashboard.

## Technology Stack

This application is built with a modern, powerful, and scalable tech stack:

*   **Framework**: **Next.js** (using the App Router) with **React**. This provides a high-performance foundation with both server-side rendering and client-side interactivity.
*   **Language**: **TypeScript**. This adds strong typing to JavaScript, which helps prevent bugs and improves developer productivity.
*   **Styling**: **Tailwind CSS**. A utility-first CSS framework that allows for rapid and consistent styling.
*   **UI Components**: **ShadCN UI**. A collection of beautifully designed and accessible components that are easy to customize.
*   **Database & Authentication**: **Firebase**. We use Firestore for our real-time, cloud-hosted NoSQL database and Firebase Authentication for secure user sign-in with Google. It also provides offline data access out of the box.
*   **Generative AI**: **Genkit** (from Google). This is used for the "Smart Reminder" feature, allowing the app to understand natural language to create reminders.
*   **Charting**: **Recharts**. A composable charting library for React, used to create the beautiful charts on the dashboard.
*   **State Management**: **Zustand**. A simple and fast state management solution for React that helps manage data on the client side.

## Key Features

QuarryFlow is a comprehensive business management app designed specifically for a quarry supply or sand trucking business.

*   **📊 Interactive Dashboard**: A central hub that gives you a complete overview of your business at a glance, including total revenue, expenses, net profit, and customer counts. It features charts for sales growth and cost vs. revenue.
*   **🧾 Invoicing & Sales**: Easily create new sales records with multiple line items. You can generate professional, print-ready PDF invoices for any sale.
*   **👥 Customer Management (CRM)**: Maintain a complete record of your customers, including their contact details, address, and status.
*   **💰 Expense Tracking**: Log all your business expenses, from fuel and maintenance to salaries, to get a clear picture of your outgoings.
*   **🚚 Vehicle Fleet Management**: Keep track of all your vehicles, including their make, model, registration number, and current status (e.g., Active, In Maintenance).
*   **🏦 Collections Tracking**: Manage accounts receivable by tracking upcoming credit collections from customers, including amounts due and deadlines.
*   **🤖 AI-Powered Smart Reminders**: A standout feature where you can use natural language (e.g., "Remind me to renew insurance for truck TN 01 AB 1234 next month") to have the AI automatically parse the details and set a reminder for you.
*   **📄 Financial Reports**: Generate detailed PDF financial reports for any period (e.g., this week, this month, custom range). The reports include a full breakdown of sales, expenses, and a profit/loss statement.
*   **☁️ Cloud Sync & Offline Access**: Sign in with your Google account to securely sync all your data to the cloud. Thanks to Firebase, the app works seamlessly even when you're offline, and all changes are synced automatically when you reconnect.
*   **🛡️ Audit Log**: A complete history of all actions taken in the app (creations, updates, deletions) provides accountability and a clear trail of changes.
*   **👤 Profile Management**: Users can update their personal and company details, which are used in reports and invoices.
*   **📱 Responsive Design**: The UI is built with a mobile-first approach, ensuring a great experience on both desktop and mobile devices.


## Getting Started

This is a Next.js project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
