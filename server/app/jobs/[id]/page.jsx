'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import EditJobDialog from './editModal'
import Link from "next/link"
import { Briefcase, Building2, Columns2, Mails, MapPin, Pencil } from "lucide-react"



export default function Resume({ params }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [job, setJob] = useState({
    id: params.id,
    company: '',
    title: '',
    location: '',
    experience: '',
    content: '',
    link: ''
  })
  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then(response => response.json())
      .then(data => setJob(data))
  }, []);

  //   const setData = (data) => {
  //     if ( !data || data.length === 0) {
  //       return
  //     }
  //     const resume = data[0]
  //     setResume({
  //       id: resume.id,
  //       name: resume.name,
  //       role: resume.role,
  //       tags: resume.tags.split(','),
  //       content: resume.content
  //     })
  //   }

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
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <Building2 className="mr-2 h-6 w-6 text-blue-500" />
            <span className="text-xl">{job.company}</span>
            <span className="mx-2">•</span>
            <MapPin className="mr-2 h-6 w-6 text-green-500" />
            <span className="text-xl">{job.location}</span>
            <span className="mx-2">•</span>
            <Briefcase className="mr-2 h-6 w-6 text-red-500" />
            <span className="text-xl">{job.experience}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
        <Link href={job.link} passHref>
            <Button variant="outline" as="a">
              <Mails className="mr-2 h-4 w-4" />
              Apply</Button>
          </Link>
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Job</Button>
          <Link href={`/jobs/${params.id}/interactive`} passHref>
            <Button as="a">
              <Columns2 className="mr-2 h-4 w-4" />
              Edit Resume</Button>
          </Link>
        </div>
      </div>
      {/* <Card className="mb-6">
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
      </Card> */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{job.content}</div>
        </CardContent>
      </Card>
       <EditJobDialog 
        isEditModalOpen={isEditModalOpen} 
        setIsEditModalOpen={setIsEditModalOpen} 
        job={job} 
      /> 

    </div>
  )
}

