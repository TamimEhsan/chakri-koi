"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useCallback, useEffect, useState } from "react"

export default function SimilarityCalculator({ params }) {
    const [userInput, setUserInput] = useState("")
    const [similarity, setSimilarity] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const [job, setJob] = useState({
        id: params.id,
        title: '',
        location: '',
        experience: '',
        content: ''
    })
    useEffect(() => {
        fetch(`/api/jobs/${params.id}`)
            .then(response => response.json())
            .then(data => setJob(data))
    }, []);

    const calculateSimilarity = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/jobs/${params.id}/score`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userInput }),
            })
            const data = await response.json()
            setSimilarity(data.similarity)
        } catch (error) {
            console.error("Error calculating similarity:", error)
        } finally {
            setIsLoading(false)
        }
    }, [userInput])



    return (
    <div className="min-h-screen max-h-screen flex flex-col p-6 bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Similarity Calculator</h1>
      </header>
      
      <main className="flex-grow flex flex-col space-y-6">
        <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-foreground">Similarity:</span>
            <Progress value={similarity*100} className="w-64" />
            <span className="text-lg font-semibold text-foreground">{(similarity*100).toFixed(2)}%</span>
          </div>
          <Button onClick={calculateSimilarity} disabled={isLoading} size="lg">
            {isLoading ? "Calculating..." : "Recalculate"}
          </Button>
        </div>
        
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="userInput" className="text-sm font-medium text-foreground">
              Your Resume Content
            </label>
            <Textarea
              id="userInput"
              placeholder="Enter your text here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow resize-none"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-foreground">Reference Job Description</label>
            <div className=" p-3 border rounded-md overflow-y-auto bg-muted">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              <p className="text-foreground">
                
                {job.content}
                
              </p>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </div>
    )
}

