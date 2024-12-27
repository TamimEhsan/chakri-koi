import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';


const EditJobDialog = ({ isEditModalOpen, setIsEditModalOpen, job }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: job.id,
    link: job.link,
    title: job.title,
    location: job.location,
    experience: job.experience,
    content: job.content,
  });

  useEffect(() => {
    setFormData({
      id: job.id,
      link: job.link,
      title: job.title,
      location: job.location,
      experience: job.experience,
      content: job.content,
    });
    }, [job]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.refresh(); // Reload the current page
      } else {
        console.error('Failed to update job');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <SheetContent style={{ width: '100%', maxWidth: '600px' }}>
        <SheetHeader>
          <SheetTitle>Edit Job</SheetTitle>
        </SheetHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} placeholder="Title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={formData.location} onChange={handleChange} placeholder="Location" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Input id="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Job Link</Label>
            <Input id="link" value={formData.link} onChange={handleChange} placeholder="Job Link" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Job Content</Label>
            <Textarea 
            className='h-96' id="content" value={formData.content} onChange={handleChange} placeholder="Job Content" />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditJobDialog;