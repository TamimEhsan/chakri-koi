import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Building2, FileText, Sparkles, SquarePlus } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Chakri Koi?</h1>
        <p className="text-xl text-muted-foreground">Find the perfect match between resumes and job posts</p>
        <Button asChild size="lg">
          <Link href="/matcher">Go to Matcher</Link>
        </Button>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center text-blue-500'>
                <Sparkles className="h-8 w-8 mr-2 " />
                Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Our advanced algorithm matches resumes with job posts for optimal results.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center text-yellow-500'>
                <Building2 className="h-8 w-8 mr-2 " />
                Company Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Easily manage companies, their job posts, and track matching progress.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center text-green-500'>
                <FileText className="h-8 w-8 mr-2 " />
                Resume Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Store and manage resumes with tags for efficient organization and searching.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

