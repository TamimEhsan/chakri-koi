import { Building2, MapPin, Briefcase, FileText } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'



export default function JobCards({ jobs, resume }) {
    const getProgressColor = (value) => {

        const red = Math.min(255, Math.floor((1 - value) * 255));
        const green = Math.min(255, Math.floor(value * 255));
        return `rgb(${red}, ${green}, 0)`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-primary">Job Matches</h1>
            <div className="space-y-4">
                {jobs.map((job, index) => (
                    <Card key={index} className="w-full">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold mb-2 text-primary">{job.title}</h2>
                                <div className="flex items-center mb-2 text-muted-foreground">
                                    <Building2 className="mr-2 h-4 w-4 text-blue-500" />
                                    <span>{job.name}</span>
                                    <span className="mx-2">•</span>
                                    <MapPin className="mr-2 h-4 w-4 text-green-500" />
                                    <span>{job.location}</span>
                                    <span className="mx-2">•</span>
                                    <Briefcase className="mr-2 h-4 w-4 text-red-500" />
                                    <span>{job.experience}</span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <Badge variant="secondary"
                                        className="text-primary mr-2"
                                        style={{ color: getProgressColor(job.similarity) }}
                                    >
                                        {(job.similarity * 100).toFixed(2)}% Match
                                    </Badge>
                                    <Progress
                                        value={(job.similarity * 100).toFixed(2)}
                                        style={{ color: getProgressColor(job.similarity) }}
                                        className="w-32" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                                <Link href={`/resumes/${resume.id}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="w-36" >
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Resume
                                    </Button>
                                </Link>
                                <Link href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="w-36 bg-primary text-primary-foreground hover:bg-primary/90">
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Job
                                    </Button>
                                </Link>

                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

