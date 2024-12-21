'use client'

import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Reindex({ params }) {
  const [progress, setProgress] = useState(0)
  const [indexedPages, setIndexedPages] = useState([])

  // Mock company data
  const company = {
    id: params.id,
    name: 'TechCorp',
  }

  useEffect(() => {
    // Simulate indexing process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })

      setIndexedPages(prev => [
        ...prev,
        {
          url: `https://techcorp.com/page-${prev.length + 1}`,
          indexed: Math.random() > 0.2,
          matched: Math.random() > 0.5,
        }
      ])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reindexing: {company.name}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Indexing Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-muted-foreground">Progress: {progress}% ({indexedPages.length} pages processed)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Indexed Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {indexedPages.map((page, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="flex-grow">{page.url}</span>
                <span className={`w-4 h-4 rounded-full ${page.indexed ? 'bg-green-500' : 'bg-red-500'}`} title={page.indexed ? 'Indexed' : 'Not Indexed'}></span>
                <span className={`w-4 h-4 rounded-full ${page.matched ? 'bg-blue-500' : 'bg-gray-300'}`} title={page.matched ? 'Matched' : 'Not Matched'}></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

