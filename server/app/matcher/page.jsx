'use client'

// import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from 'react'
import JobCards from './jobCard'
export default function Matcher() {
  // const [selectedCompanies, setSelectedCompanies] = useState([])
  // const [selectedResumes, setSelectedResumes] = useState([])
  // const [selectedRoles, setSelectedRoles] = useState([])

  // Mock data for matches
  const [matches, setMatches] = useState([])
  useEffect(() => {
    fetch('/api/matcher')
      .then(response => response.json())
      .then(data => setMatches(data))
  }, [])
  // const matches = [
  //   { id: 1, company: 'TechCorp', job: 'Software Engineer', role: 'Frontend', resume: 'John Doe', matchPercentage: 95 },
  //   { id: 2, company: 'DataInc', job: 'Data Analyst', role: 'Analytics', resume: 'Jane Smith', matchPercentage: 88 },
  //   { id: 3, company: 'DesignHub', job: 'UI/UX Designer', role: 'Design', resume: 'Mike Johnson', matchPercentage: 92 },
  // ]

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Companies</h3>
              {/* Add company filter checkboxes here */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="techcorp" />
                  <Label htmlFor="techcorp">Google</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="datainc" />
                  <Label htmlFor="datainc">Microsoft</Label>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resumes</h3>
              {/* Add resume filter checkboxes here */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="johndoe" />
                  <Label htmlFor="johndoe">Resume 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="janesmith" />
                  <Label htmlFor="janesmith">Resume 2</Label>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Roles</h3>
              {/* Add role filter checkboxes here */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="frontend" />
                  <Label htmlFor="frontend">Frontend</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="backend" />
                  <Label htmlFor="backend">Backend</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
      <main className="flex-grow">
        <h1 className="text-3xl font-bold mb-6">Matcher</h1>
        <div className="space-y-4">
          {matches.map(match => (
            <>
            <h2 key={match.id} className="text-xl font-semibold"> 
              {match.role}
            </h2>
            <JobCards jobs={match.jobs} resume={match} />
            {/* {match.jobs.map(job => (
                <Card key={match.id}>
                <CardContent className="flex justify-between items-center p-6">
                  <div>
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-muted-foreground">Company: {job.name}</p>
                    <p className="text-muted-foreground">Location: {job.location}</p>
                    <p className="text-muted-foreground">Match: {(job.similarity * 100).toFixed(2)}%</p>
                  </div>
                  <div className="space-x-2">
                    <Button asChild variant="outline">
                      <Link href={`/resumes/${match.id}`}>View Resume</Link>
                    </Button>
                    <Button asChild>
                      <Link href={`https://google.com`} target="_blank" rel="noopener noreferrer">View Job</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))} */}
              </>
          ))}
        </div>
      </main>
    </div>
  )
}

