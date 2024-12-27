'use client'

import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { set } from 'date-fns'

export default function Reindex({ params }) {
  const [progress, setProgress] = useState(0)
  const [indexedPages, setIndexedPages] = useState([])
  const [indexing, setIndexing] = useState(false)
  const [disabled, setDisabled] = useState(false)

  // Mock company data
  const company = {
    id: params.id,
    name: 'Google',
  }

  useEffect(() => {
    startPooling(params.id)
  }, [params.id])

  const startPooling = async () => {
    const response = await fetch(`/api/companies/${params.id}/reindex`);
    const data = await response.json();
    console.log(data);
    if (!data || data.status === 404 || data.indexing === false) return;
    setIndexing(true)
    setDisabled(true)
    shortPooling()
  }

  const shortPooling = async () => {

    const response = await fetch(`/api/companies/${params.id}/reindex`);
    const data = await response.json();
    if (!data || data.status === 404) {
      setDisabled(false)
      return;
    }
    const { indexed, errored, total } = getAggregate(data.pages)
    console.log(indexed, errored, total)
    setProgress(((indexed + errored) / total) * 100)
    setIndexedPages(data.pages)

    // call the function again after 1 second
    if (data.indexing === false) {
      setDisabled(false)
      return;
    }
    setTimeout(shortPooling, 1000)
  }

  const getAggregate = (data) => {
    if (!data || !data.length) return { indexed: 0, errored: 0, total: 0 }
    let indexed = 0;
    let errored = 0;
    data.forEach((page) => {
      if (page.status === 1) indexed++;
      if (page.status === 2) errored++;
    })
    return { indexed, errored, total: data.length }
  }


  // useEffect(() => {

  //   // create a post api call to the server

  //   // Simulate indexing process
  //   const interval = setInterval(() => {
  //     setProgress(prev => {
  //       if (prev >= 100) {
  //         clearInterval(interval)
  //         return 100
  //       }
  //       return prev + 10
  //     })

  //     setIndexedPages(prev => [
  //       ...prev,
  //       {
  //         url: `https://techcorp.com/page-${prev.length + 1}`,
  //         indexed: Math.random() > 0.2,
  //         matched: Math.random() > 0.5,
  //       }
  //     ])
  //   }, 1000)

  //   return () => clearInterval(interval)
  // }, [])

  const startIndexing = async () => {
    const response = await fetch(`/api/companies/${params.id}/reindex`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyId: company.id }),
    });
    const data = await response.json();
    setTimeout(startPooling, 1000)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reindexing: {company.name}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Indexing Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {indexing && <>
            <Progress value={progress} className="w-full" />
            <p className="mt-2 text-muted-foreground">Progress: {progress.toFixed(2)}% ({indexedPages.length} pages found)</p>
          </>}
          <Button className="mt-4" disabled={disabled} onClick={startIndexing}>Start</Button>

        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Indexed Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {indexedPages.map((page, index) => (
              <>
                <div key={index} className="flex items-center space-x-4">
                  <span className="truncate overflow-hidden text-ellipsis">{page.page_link}</span>
                  <span className={`w-4 h-4 rounded-full ${page.status !== 0 ? 'bg-green-500' : 'bg-red-500'}`} title={page.status !== 0 ? 'Indexed' : 'Not Indexed'}></span>
                  <span className={`w-4 h-4 rounded-full ${page.status === 1 ? 'bg-blue-500' : 'bg-gray-300'}`} title={page.status === 1 ? 'Matched' : 'Not Matched'}></span>

                </div>
                <Separator className='w-full' />
              </>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

