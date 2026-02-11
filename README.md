# SmartBMI 🏋️‍♂️

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://bmi-health-predict.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SmartBMI** is a modern, responsive web application built with **React, TypeScript, Vite, and TailwindCSS** that allows users to calculate their **Body Mass Index (BMI)**, track BMI history, visualize trends, and receive personalized health recommendations.  

It is designed for both **desktop and mobile users**, with an intuitive UI and interactive charts for a better user experience.

---

## 🌟 Features

- **BMI Calculator:** Quickly calculate your BMI by entering height and weight.
- **BMI History Panel:** Track and view your previous BMI records.
- **Interactive Charts:** Visualize BMI trends over time.
- **Health Recommendations:** Receive personalized health tips based on BMI.
- **Responsive Design:** Works seamlessly across mobile, tablet, and desktop.
- **Modern UI Components:** Built with reusable components for scalability.

---

## 🛠 Tech Stack

| Layer                  | Technology                     |
|------------------------|--------------------------------|
| Frontend               | React, TypeScript, Vite        |
| Styling                | TailwindCSS                    |
| Charts / Visualization | Recharts / Custom Components   |
| State Management       | React Context + Custom Hooks   |
| Deployment             | Vercel (Free Tier)             |

---

## 📂 Project Structure

```text
SmartBMI/
├── public/                # Static files (images, robots.txt)
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main pages (Index, NotFound)
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React context for global state
│   ├── lib/               # Utility functions & data handling
│   ├── App.tsx            # Root component
│   ├── main.tsx           # React entry point
│   └── index.css / App.css
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
