export const metadata = {
  title: "AgroSmart - Smart Irrigation System",
  description: "ESP32-based smart irrigation monitoring and control system",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="apple-touch-icon" href="/agrosmart-logo.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}


import './globals.css'