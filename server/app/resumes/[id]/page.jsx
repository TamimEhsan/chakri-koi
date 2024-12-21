'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import EditResumeDialog from './editModal'


export default function Resume({ params }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [resume, setResume] = useState({
    id: params.id,
    name: '',
    role: '',
    tags: [],
    content: ''
  })
  useEffect(() => {
    fetch(`/api/resumes/${params.id}`)
      .then(response => response.json())
      .then(data => setData(data))
  }, []);

  const setData = (data) => {
    if ( !data || data.length === 0) {
      return
    }
    const resume = data[0]
    setResume({
      id: resume.id,
      name: resume.name,
      role: resume.role,
      tags: resume.tags.split(','),
      content: resume.content
    })
  }

  // Mock data for resume
  // const resume = {
  //   id: params.id,
  //   name: 'John Doe',
  //   role: 'Software Engineer',
  //   tags: ['JavaScript', 'React', 'Node.js'],
  //   content: `
  //     Experienced software engineer with a strong background in web development.
  //     Proficient in JavaScript, React, and Node.js.
  //     5+ years of experience in building scalable web applications.
  //     Strong problem-solving skills and ability to work in a team environment.
  //   `,
  // }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{resume.name}</h1>
          <p className="text-xl text-muted-foreground">{resume.role}</p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>Edit</Button>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-x-2">
            {resume.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resume Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{resume.content}</div>
        </CardContent>
      </Card>
      <EditResumeDialog 
        isEditModalOpen={isEditModalOpen} 
        setIsEditModalOpen={setIsEditModalOpen} 
        resume={resume} 
      />
      
    </div>
  )
}

