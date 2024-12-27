import { UserCircle2, CloudDownload, Heart } from 'lucide-react'

export function HowItWorks() {
    const steps = [
        {
            icon: <UserCircle2 className="w-8 h-8 text-white" />,
            title: "Edit Your Resume",
            description: "Edit your resume with our easy to use resume builder, with the job description by side to make sure you are on the right track.",
            bgColor: "bg-pink-500"
        },
        {
            icon: <CloudDownload className="w-8 h-8 text-white" />,
            title: "Rewrite with AI",
            description: "Our AI will help you rewrite your resume to match the job description, increasing your chances of getting hired.",
            bgColor: "bg-cyan-500"
        },
        {
            icon: <Heart className="w-8 h-8 text-white" />,
            title: "Grammar Check",
            description: "Our grammar checker will make sure your resume is free of any grammatical errors.",
            bgColor: "bg-amber-500"
        }
    ]

    return (

        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-16">Polish Your Resume</h2>
            <div className="">
                {steps.map((step, index) => (
                    <div key={index} className="mb-5">
                        <h3 className="text-xl font-semibold mb-0">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

