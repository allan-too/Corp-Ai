
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import FileUploader from './FileUploader';
import ChatWidget from './ChatWidget';
import { studentApi } from '../../api/toolsApi';

interface UploadedFile {
  id: string;
  filename: string;
}

interface Summary {
  summary: string;
}

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardsData {
  cards: Flashcard[];
}

interface WritingImprovement {
  improved_text: string;
}

interface Citations {
  apa: string;
  mla: string;
}

interface Transcription {
  text: string;
}

interface StudentData {
  uploadedFile: UploadedFile | null;
  summary: Summary | null;
  flashcards: FlashcardsData | null;
  writingText: string;
  writingImprovement: WritingImprovement | null;
  citationSource: string;
  citations: Citations | null;
  transcription: Transcription | null;
}

interface LoadingState {
  upload: boolean;
  summarize: boolean;
  flashcards: boolean;
  writing: boolean;
  citation: boolean;
}

const StudentTabs = () => {
  const [activeData, setActiveData] = useState<StudentData>({
    uploadedFile: null,
    summary: null,
    flashcards: null,
    writingText: '',
    writingImprovement: null,
    citationSource: '',
    citations: null,
    transcription: null,
  });

  const [isLoading, setIsLoading] = useState<LoadingState>({
    upload: false,
    summarize: false,
    flashcards: false,
    writing: false,
    citation: false,
  });

  const handleFileUpload = async (file: File) => {
    setIsLoading(prev => ({ ...prev, upload: true }));
    try {
      const response = await studentApi.uploadNotes(file);
      setActiveData(prev => ({ ...prev, uploadedFile: response.data }));
      return response.data;
    } finally {
      setIsLoading(prev => ({ ...prev, upload: false }));
    }
  };

  const handleSummarize = async () => {
    if (!activeData.uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload notes first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, summarize: true }));
    try {
      const response = await studentApi.summarizeNotes({ 
        file_id: activeData.uploadedFile.id 
      });
      setActiveData(prev => ({ ...prev, summary: response.data }));
      toast({
        title: "Success",
        description: "Summary generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, summarize: false }));
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!activeData.uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload notes first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, flashcards: true }));
    try {
      const response = await studentApi.generateFlashcards({ 
        file_id: activeData.uploadedFile.id 
      });
      setActiveData(prev => ({ ...prev, flashcards: response.data }));
      toast({
        title: "Success",
        description: "Flashcards generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, flashcards: false }));
    }
  };

  const handleChat = async (message: string) => {
    const response = await studentApi.chatWithAI({ message });
    return response.data.response;
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="summarize">Summarize</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        <TabsTrigger value="writing">Writing</TabsTrigger>
        <TabsTrigger value="cite">Citations</TabsTrigger>
        <TabsTrigger value="transcribe">Transcribe</TabsTrigger>
        <TabsTrigger value="chat">AI Chat</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload Study Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader
              onFileUpload={handleFileUpload}
              acceptedFileTypes={['.pdf', '.docx', '.txt', '.md']}
              title="Upload Notes or Documents"
              description="Upload your study materials for analysis"
            />
            {activeData.uploadedFile && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700">
                  ✓ File uploaded successfully: {activeData.uploadedFile.filename}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="summarize" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSummarize} 
              disabled={isLoading.summarize || !activeData.uploadedFile}
              className="w-full"
            >
              {isLoading.summarize ? 'Generating Summary...' : 'Generate Summary'}
            </Button>
            
            {activeData.summary && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Summary:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {activeData.summary.summary}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="flashcards" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Flashcards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateFlashcards} 
              disabled={isLoading.flashcards || !activeData.uploadedFile}
              className="w-full"
            >
              {isLoading.flashcards ? 'Generating Flashcards...' : 'Generate Flashcards'}
            </Button>
            
            {activeData.flashcards?.cards && (
              <div className="space-y-3">
                <h3 className="font-semibold">Flashcards ({activeData.flashcards.cards.length}):</h3>
                {activeData.flashcards.cards.map((card, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="font-medium text-blue-600 mb-2">Q: {card.question}</div>
                    <div className="text-gray-700">A: {card.answer}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="writing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Writing Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here for improvement suggestions..."
              className="min-h-[200px]"
              value={activeData.writingText || ''}
              onChange={(e) => setActiveData(prev => ({ ...prev, writingText: e.target.value }))}
            />
            <Button 
              onClick={async () => {
                if (!activeData.writingText) return;
                setIsLoading(prev => ({ ...prev, writing: true }));
                try {
                  const response = await studentApi.improveWriting({ text: activeData.writingText });
                  setActiveData(prev => ({ ...prev, writingImprovement: response.data }));
                } finally {
                  setIsLoading(prev => ({ ...prev, writing: false }));
                }
              }}
              disabled={isLoading.writing || !activeData.writingText}
              className="w-full"
            >
              {isLoading.writing ? 'Analyzing...' : 'Improve Writing'}
            </Button>
            
            {activeData.writingImprovement && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Suggestions:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {activeData.writingImprovement.improved_text}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cite" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Citation Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter source information (URL, book title, etc.)..."
              value={activeData.citationSource || ''}
              onChange={(e) => setActiveData(prev => ({ ...prev, citationSource: e.target.value }))}
            />
            <Button 
              onClick={async () => {
                if (!activeData.citationSource) return;
                setIsLoading(prev => ({ ...prev, citation: true }));
                try {
                  const response = await studentApi.generateCitations({ source: activeData.citationSource });
                  setActiveData(prev => ({ ...prev, citations: response.data }));
                } finally {
                  setIsLoading(prev => ({ ...prev, citation: false }));
                }
              }}
              disabled={isLoading.citation || !activeData.citationSource}
              className="w-full"
            >
              {isLoading.citation ? 'Generating...' : 'Generate Citations'}
            </Button>
            
            {activeData.citations && (
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">APA:</h4>
                  <p className="text-sm font-mono">{activeData.citations.apa}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">MLA:</h4>
                  <p className="text-sm font-mono">{activeData.citations.mla}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="transcribe" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Audio Transcription</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader
              onFileUpload={async (file) => {
                const response = await studentApi.transcribeAudio(file);
                setActiveData(prev => ({ ...prev, transcription: response.data }));
                return response.data;
              }}
              acceptedFileTypes={['.mp3', '.wav', '.m4a']}
              title="Upload Audio File"
              description="Upload audio lectures or recordings for transcription"
            />
            {activeData.transcription && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Transcription:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {activeData.transcription.text}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chat" className="space-y-4">
        <ChatWidget
          onSendMessage={handleChat}
          title="Study Assistant AI"
          placeholder="Ask questions about your uploaded materials..."
        />
      </TabsContent>
    </Tabs>
  );
};

export default StudentTabs;
