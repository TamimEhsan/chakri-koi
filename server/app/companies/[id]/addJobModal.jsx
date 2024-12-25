'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"


const AddJobModal = ({ isAddJobModalOpen, setIsAddJobModalOpen, companyId }) => {

    const [formData, setFormData] = useState({
        link: '',
        company_id: companyId,
        title: '',
        // datePosted: '',
        location: '',
        experience: '',
        content: ''
    })

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`/api/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            
            setFormData({
                link: '',
                company_id: companyId,
                title: '',
                // datePosted: '',
                location: '',
                experience: '',
                content: ''
            });
            setIsAddJobModalOpen(false);
            // router.refresh();
        }
    }

    return (
        <Dialog open={isAddJobModalOpen} onOpenChange={setIsAddJobModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Job</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="link">Job Post Link</Label>
                        <Input id="link" placeholder="Job Post Link" value={formData.link} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Job Name</Label>
                        <Input id="title" placeholder="Job Title" value={formData.title} onChange={handleChange} />
                    </div>
                    {/* <div className="space-y-2">
              <Label htmlFor="job-date">Date Posted</Label>
              <Input id="job-date" type="date" placeholder="Date Posted" />
            </div> */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input id="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Job Description</Label>
                        <Textarea id="content" placeholder="Job Description" value={formData.content} onChange={handleChange} />
                    </div>
                    <Button type="submit">Add Job</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddJobModal;