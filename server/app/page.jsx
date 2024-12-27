import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileText, Sparkles } from 'lucide-react'

import { HowItWorks } from "./how-it-works"


export default function LandingPage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">Chakri Koi?</h1>
            <p className="text-xl mb-8">
              Your one stop solution for job matching that helps you find the best job posts.
            </p>
            <Button size="lg">Get Started</Button>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/hero-image.png?height=400&width=600"
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={"flex items-center"}>
                  <feature.logo className="h-8 w-8 mr-2" />
                  {feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[300px]">
            <Image
              src="/images/screenshot-grammar.png?height=300&width=500"
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <HowItWorks />
        </div>
      </section>
      {/* Additional Sections */}
      {additionalSections.map((section, index) => (
        <section key={index} className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {index % 2 === 0 ? (
              <>
                <div>
                  <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                  <p className="text-xl mb-8">{section.description}</p>
                  
                </div>
                <div className="relative h-[300px]">
                  <Image
                    src={section.image}
                    alt={section.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative h-[300px]">
                  <Image
                    src={section.image}
                    alt={section.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                  <p className="text-xl mb-8">{section.description}</p>
                  
                </div>
              </>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

const features = [
  {
    title: "Smart Matching",
    logo: Sparkles,
    description: "Our advanced algorithm matches resumes with job posts for optimal results."
  },
  {
    title: "Company Management",
    logo: Building2,
    description: "Easily manage companies, their job posts, and track matching progress"
  },
  {
    title: "Resume Management",
    logo: FileText,
    description: "Store and manage resumes with tags for efficient organization and searching."
  }
]

const additionalSections = [
  {
    title: "Increase your chances",
    description: "Find the best match of your resume with the job post to increase your chances of getting hired.",
    image: "/images/screenshot-job-match.png"
  },
  {
    title: "Scraping Made Easy",
    description: "With easy to make templates, scrape job posts effortlessly from popular job boards and save them to your account.",
    image: "/images/image.png"
  }
]

