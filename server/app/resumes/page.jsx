'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddResumeModal from './addResumeModal'
import { Plus } from "lucide-react"
export default function Resumes() {
  // const router = useRouter()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    fetch('/api/resumes')
      .then(response => response.json())
      .then(data => setResumes(processData(data)))
  }, [])

  const processData = (data) => {
    return data.map((resume) => {
      return {
        ...resume,
        tags: resume.tags.split(',')
      }
    })
  }

  const filteredResumes = resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Resume</Button>
      </div>
      <Input
        type="text"
        placeholder="Search resumes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResumes.map(resume => (
          <Card key={resume.id}>
            <CardContent className="p-6">
              <Link href={`/resumes/${resume.id}`} className="block hover:underline">
                <CardTitle className="text-xl mb-2">{resume.name}</CardTitle>
              </Link>
              <p className="text-muted-foreground">{resume.role}</p>
              <div className="mt-2 space-x-2">
                {resume.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AddResumeModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen} />

    </div>
  )
}

