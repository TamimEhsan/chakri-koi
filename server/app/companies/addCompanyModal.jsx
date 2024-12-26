'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from 'react'


const AddCompanyModal = ({ isAddModalOpen, setIsAddModalOpen }) => {
/*
name TEXT,
    start_url TEXT,
    base_url TEXT,
    title_selector TEXT,
    location_selector TEXT,
    experience_selector TEXT,
    content_selector TEXT
*/
    const [formData, setFormData] = useState({
        name: '',
        start_url: '',
        base_url: '',
        title_selector: '',
        location_selector: '',
        experience_selector: '',
        content_selector: ''
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
        const response = await fetch('/api/companies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            setFormData({
                name: '',
                start_url: '',
                base_url: '',
                title_selector: '',
                location_selector: '',
                experience_selector: '',
                content_selector: ''
            });
            setIsAddModalOpen(false);
            // router.refresh();
        }
    }

    return (
        <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <SheetContent style={{ width: '100%', maxWidth: '600px' }}>
                <SheetHeader>
                    <SheetTitle>Add New Company</SheetTitle>
                    <SheetDescription>
                        Enter the details of the new company.
                    </SheetDescription>
                </SheetHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="start_url">Start URL</Label>
                        <Input id="start_url" placeholder="Start URL" value={formData.start_url} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="base_url">Base URL</Label>
                        <Input id="base_url" placeholder="Base URL" value={formData.base_url} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title_selector">Title Selector</Label>
                        <Input id="title_selector" placeholder="Title Selector" value={formData.title_selector} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location_selector">Location Selector</Label>
                        <Input id="location_selector" placeholder="Location Selector" value={formData.location_selector} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="experience_selector">Experience Selector</Label>
                        <Input id="experience_selector" placeholder="Experience Selector" value={formData.experience_selector} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content_selector">Content Selector</Label>
                        <Input id="content_selector" placeholder="Content Selector" value={formData.content_selector} onChange={handleChange} />
                    </div>
                    <Button type="submit">Add Company</Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default AddCompanyModal;