'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from 'react'


const EditCompanyModal = ({ isEditModalOpen, setIsEditModalOpen, company }) => {
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

    useEffect(() => {
        setFormData({
            name: company.name,
            start_url: company.start_url,
            base_url: company.base_url,
            title_selector: company.title_selector,
            location_selector: company.location_selector,
            experience_selector: company.experience_selector,
            content_selector: company.content_selector
        });
    }, [company]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`/api/companies/${company.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            console.log('Company Edited successfully!')
            setFormData({
                name: '',
                start_url: '',
                base_url: '',
                title_selector: '',
                location_selector: '',
                experience_selector: '',
                content_selector: ''
            });
            setIsEditModalOpen(false);
            // router.refresh();
        }
    }

    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new company.
                    </DialogDescription>
                </DialogHeader>
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
                    <Button type="submit">Edit Company</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditCompanyModal;