
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  title?: string;
  description?: string;
  uploadedFile?: File | null;
  onRemoveFile?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedFileTypes = ['.pdf', '.txt', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB
  title = "Upload File",
  description = "Drag and drop your file here, or click to select",
  uploadedFile,
  onRemoveFile
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      try {
        onFileUpload(file);
        toast({
          title: "Success",
          description: `File "${file.name}" uploaded successfully!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false
  });

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <Card 
          {...getRootProps()} 
          className={`glass-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/30 border-2 border-dashed ${
            isDragActive 
              ? 'border-neon-blue bg-neon-blue/10' 
              : 'border-white/30 dark:border-white/20 hover:border-neon-blue/50'
          }`}
        >
          <input {...getInputProps()} />
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Upload 
                className={`h-12 w-12 transition-colors duration-300 ${
                  isDragActive ? 'text-neon-blue' : 'text-foreground/60'
                }`} 
              />
              <div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-foreground/60 mt-1">{description}</p>
                <p className="text-xs text-foreground/40 mt-2">
                  Accepted formats: {acceptedFileTypes.join(', ')} • Max size: {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
              {isDragActive && (
                <p className="text-neon-blue font-medium">Drop the file here...</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-neon-blue" />
                <div>
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-foreground/60">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {onRemoveFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveFile}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {isUploading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-neon-blue">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-blue"></div>
            <span>Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
