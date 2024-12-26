import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditResumeDialog = ({ isEditModalOpen, setIsEditModalOpen, resume }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: resume.id,
    name: resume.name,
    role: resume.role,
    tags: resume.tags.join(','),
    content: resume.content,
  });

  useEffect(() => {
    setFormData({
        id: resume.id,
        name: resume.name,
        role: resume.role,
        tags: resume.tags.join(','),
        content: resume.content,
    });
    }, [resume]);

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
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).join(','),
        }),
      });

      if (response.ok) {
        
        router.refresh(); // Reload the current page
      } else {
        console.error('Failed to update resume');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <SheetContent style={{ width: '100%', maxWidth: '600px' }}>
        <SheetHeader>
          <SheetTitle>Edit Resume</SheetTitle>
        </SheetHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={formData.role} onChange={handleChange} placeholder="Role" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Resume Content</Label>
            <Textarea id="content" value={formData.content} onChange={handleChange} placeholder="Resume Content" className='h-96' />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditResumeDialog;