import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react"


export default function GrammarCheck({ grammarCheck }) {

    const [innerHtml, setinnerHtml] = useState("")
    const [parts, setParts] = useState([]);
    function getHoverCard(original_text, corrected_text, message, suggestions) {
        return <HoverCard>
            <HoverCardTrigger asChild>
                <Button className="text-md text-red-500 p-0 underline underline-offset-2 decoration-red-500" variant="link">{original_text}</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="p-2 px-3 rounded-md  text-sm bg-red-200 line-through">{original_text}</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="p-2 px-3 rounded-md  text-sm bg-primary  text-primary-foreground">{corrected_text}</span>
                        </div>
                        <h4 className="text-md my-2">{message}</h4>
                        <div className="flex items-center space-x-2">
                            {suggestions.slice(0, 3).map((suggestion, index) => (
                                <span key={index} className="p-1 px-2 rounded-md  text-sm bg-blue-300  text-primary-foreground">{suggestion}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    }

    useEffect(() => {
        let text = grammarCheck.original_text;
        let parts = [];
        let lastIndex = 0;

        // Loop over the grammarCheck.issues and apply a border span from offset to length
        for (let issue of grammarCheck.issues) {
            let issueText = text.slice(issue.offset, issue.offset + issue.length);
            let replacement = getHoverCard(issueText, issue.suggestions[0], issue.message, issue.suggestions);

            // Add text before the issue
            if (issue.offset > lastIndex) {
                parts.push(text.slice(lastIndex, issue.offset));
            }

            // Add the replacement React element
            parts.push(replacement);

            // Update the last index
            lastIndex = issue.offset + issue.length;
        }

        // Add remaining text after the last issue
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        setParts(parts);
    }, [grammarCheck])

    return (
        <div className="overflow-y-auto text-lg">
            <ScrollArea className="h-[700px] w-full rounded-md border p-4">
                {parts.map((part, index) => (
                    <span key={index}>{part}</span>
                ))}
            </ScrollArea>
        </div>
    )


}