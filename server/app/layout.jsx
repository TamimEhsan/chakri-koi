import Link from 'next/link'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: 'Chakri Koi?',
  description: 'Match resumes with job posts',
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <header className="bg-background border-b">
              <nav className="container mx-auto px-4 py-4 flex items-center justify-between text-primary">
                <Link href="/" className="text-xl font-bold ">Chakri Koi?</Link>
                <ul className="flex space-x-4">
                  <li><Link href="/matcher" className="hover:underline">Matcher</Link></li>
                  <li><Link href="/companies" className="hover:underline">Companies</Link></li>
                  <li><Link href="/resumes" className="hover:underline">Resumes</Link></li>
                </ul>
              </nav>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-background border-t py-4">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                &copy; 2023 Chakri Koi?. All rights reserved.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

