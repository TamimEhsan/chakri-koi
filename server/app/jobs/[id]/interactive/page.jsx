"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { BookOpenCheck, ListRestart, Sparkles } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import AISuggestion from "./aiSuggestion"
import GrammarCheck from "./grammarCheck"


export default function SimilarityCalculator({ params }) {
  const [userInput, setUserInput] = useState("")
  const [similarity, setSimilarity] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isGrammarLoading, setIsGrammarLoading] = useState(false)
  const [grammarText, setGrammarText] = useState({
    original_text: "",
    corrected_text: ""
  })

  const [grammarCheck, setGrammarCheck] = useState({
    original_text: "",
    corrected_text: "",
    issues:[]
  })


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


  const calculateGrammar = useCallback(async () => {
    setIsGrammarLoading(true)
    try {
      const response = await fetch(`/api/matcher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      })
      const data = await response.json()
      setGrammarText(data)
    } catch (error) {
      console.error("Error calculating grammar:", error)
    } finally {
      setIsGrammarLoading(false)
    }
  }, [userInput])

  const checkGrammar = useCallback(async () => {
    setIsGrammarLoading(true)
    try {
      const response = await fetch(`/api/matcher/grammar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      })
      const data = await response.json()
      console.log(data);
      setGrammarCheck(data)
    } catch (error) {
      console.error("Error calculating grammar:", error)
    } finally {
      setIsGrammarLoading(false)
    }
  }, [userInput])

  return (
    <div className="flex flex-col  pb-6 bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Resume Enhance</h1>
      </header>

      <main className="flex-grow flex flex-col space-y-6">
        <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-foreground">Similarity:</span>
            <Progress value={similarity * 100} className="w-64" />
            <span className="text-lg font-semibold text-foreground">{(similarity * 100).toFixed(2)}%</span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={checkGrammar} disabled={isGrammarLoading} size="lg">
              <BookOpenCheck className="mr-2 h-6 w-6" />
              {isGrammarLoading ? "Checking..." : "Grammar Rule"}
            </Button>
            <Button variant="outline" onClick={calculateGrammar} disabled={isGrammarLoading} size="lg">
              <Sparkles className="mr-2 h-6 w-6" />
              {isGrammarLoading ? "Checking..." : "AI Rewrite"}
            </Button>
            <Button onClick={calculateSimilarity} disabled={isLoading} size="lg">
              <ListRestart className="mr-2 h-6 w-6" />
              {isLoading ? "Calculating..." : "Recalculate"}
            </Button>
          </div>
        </div>

        <div className="h-[700px] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="userInput" className="text-sm font-medium text-foreground bg-muted p-2 text-center rounded-lg">
              Your Resume Content
            </label>
            <Textarea
              id="userInput"
              placeholder="Enter your text here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow resize-none"
              style={{ fontSize: '1.125rem' }}
            />
          </div>
          <div>
            <Tabs defaultValue="job-description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="job-description">Job Description</TabsTrigger>
                <TabsTrigger value="grammar-ai">AI Rewrite</TabsTrigger>
                <TabsTrigger value="grammar-rule">Grammar Check</TabsTrigger>

              </TabsList>
              <TabsContent value="job-description">
                <div className="overflow-y-auto text-lg">
                  <ScrollArea className="h-[700px] w-full rounded-md border p-4 whitespace-pre-wrap">
                    {job.content}
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="grammar-ai">
                <AISuggestion grammarText={grammarText} />
              </TabsContent>
              <TabsContent value="grammar-rule">
                <GrammarCheck grammarCheck={grammarCheck} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

