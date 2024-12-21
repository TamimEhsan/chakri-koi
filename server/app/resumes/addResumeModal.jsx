'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'


const AddResumeModal = ({ isAddModalOpen, setIsAddModalOpen }) => {

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        tags: '',
        content: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('/api/resumes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            console.log('Resume added successfully!')
            setFormData({
                name: '',
                role: '',
                tags: '',
                content: ''
            });
            setIsAddModalOpen(false);
            // router.refresh();
        }
    }

    return (
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Resume</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new resume.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" placeholder="Role" value={formData.role} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Resume Content</Label>
                        <Textarea id="content" placeholder="Resume Content" value={formData.content} onChange={handleChange} />
                    </div>
                    <Button type="submit">Add Resume</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddResumeModal;