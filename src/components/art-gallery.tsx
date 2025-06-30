'use client';

import { useState, useRef, useActionState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleImageEdit } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Upload } from 'lucide-react';

type ActionState = {
  success: boolean;
  imageUrl?: string;
  error?: string;
} | null;

export function ImageEditor() { // Renamed component
  const { toast } = useToast();
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(handleImageEdit, null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      setEditedImage(state.imageUrl!);
      toast({ title: 'Success!', description: 'Image edited successfully.' });
    } else if (state?.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        toast({ variant: 'destructive', title: 'File too large', description: 'Please use an image under 4MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setBaseImage(dataUrl);
        setEditedImage(null); // Reset edited image on new upload
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>AI Image Editor</CardTitle>
          <CardDescription>Upload an image and describe the changes you want to make.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label>1. Upload Image</Label>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                name="baseImageFile"
              />
              <input type="hidden" name="baseImage" value={baseImage || ''} />
              <Button type="button" variant="outline" className="w-full" onClick={triggerFileInput}>
                <Upload className="mr-2 h-4 w-4" />
                {baseImage ? 'Change Image' : 'Choose an Image'}
              </Button>
            </div>

            {baseImage && (
              <div className="space-y-2">
                <Label htmlFor="instruction">2. Describe Your Edit</Label>
                <Textarea
                  id="instruction"
                  name="instruction"
                  placeholder="e.g., 'make the background a starry night', 'add a pirate hat to the cat', 'change the color of the car to red'"
                  rows={4}
                  required
                />
              </div>
            )}
            
            {baseImage && (
              <div>
                <Button type="submit" disabled={isPending || !baseImage} className="w-full">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Edit
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Previews */}
      <div className="space-y-8">
        <Card className="min-h-[200px]">
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-4">
            {baseImage ? (
              <Image src={baseImage} alt="Original" width={512} height={512} className="rounded-md object-contain max-h-[40vh]" />
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <Upload className="mx-auto h-12 w-12" />
                <p className="mt-4">Upload an image to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[200px]">
          <CardHeader>
            <CardTitle>Edited Image</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-4">
            {isPending ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p>Editing your image...</p>
              </div>
            ) : editedImage ? (
              <Image src={editedImage} alt="Edited" width={512} height={512} className="rounded-md object-contain max-h-[40vh]" />
            ) : (
               <div className="text-center text-muted-foreground p-8">
                <Sparkles className="mx-auto h-12 w-12" />
                <p className="mt-4">Your edited image will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
