'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddJobModal from './addJobModal'
import EditCompanyModal from './editCompanyModal'

export default function Company({ params }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterExperience, setFilterExperience] = useState('all')

  // Mock data for company

  const [company, setCompany] = useState({
    id: params.id,
    name: '',
    website: '',
    description: 'A leading tech company specializing in innovative solutions.',
    jobs: []
  })
  useEffect(() => {
    fetch(`/api/companies/${params.id}`)
      .then(response => response.json())
      .then(data =>setCompany(data))
  }, [])

  // const company = {
  //   id: params.id,
  //   name: 'TechCorp',
  //   website: 'https://techcorp.com',
  //   description: 'A leading tech company specializing in innovative solutions.',
  // }

  // Mock data for jobs
  // const jobs = [
  //   { id: 1, name: 'Software Engineer', datePosted: '2023-05-01', location: 'New York', experience: '3-5 years' },
  //   { id: 2, name: 'Product Manager', datePosted: '2023-05-15', location: 'San Francisco', experience: '5+ years' },
  //   { id: 3, name: 'UX Designer', datePosted: '2023-05-10', location: 'Remote', experience: '2-4 years' },
  // ]

  const filteredJobs = company.jobs
    .filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()))
    // .filter(job => filterExperience === 'all' || job.experience === filterExperience)
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.name)
      // if (sortBy === 'date') return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      return 0
    })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">{company.website}</a>
          <p className="text-muted-foreground mt-2">{company.description}</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Edit</Button>
          <Button asChild>
            <Link href={`/companies/${company.id}/reindex`}>Reindex</Link>
          </Button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <div className="space-x-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="date">Sort by Date Posted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterExperience} onValueChange={setFilterExperience}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by experience..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience</SelectItem>
              <SelectItem value="0-2 years">0-2 years</SelectItem>
              <SelectItem value="3-5 years">3-5 years</SelectItem>
              <SelectItem value="5+ years">5+ years</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddJobModalOpen(true)}>Add New Job</Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <Link href="https://google.com" target="_blank" rel="noopener noreferrer" className="block hover:underline">
                <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
              </Link>
              {/* <p className="text-muted-foreground">Date Posted: {job.datePosted}</p> */}
              <p className="text-muted-foreground">Location: {job.location}</p>
              <p className="text-muted-foreground">Experience: {job.experience}</p>
            </CardContent>
          </Card>
        ))}
      </div>
        <EditCompanyModal 
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        company={company} />
      <AddJobModal 
        isAddJobModalOpen={isAddJobModalOpen}
        setIsAddJobModalOpen={setIsAddJobModalOpen}
        companyId={company.id} />
      
    </div>
  )
}

