
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CustomSelect } from '@/components/ui/custom-select';
import { toast } from '@/hooks/use-toast';
import { socialMediaApi } from '../../api/toolsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, Calendar, MessageSquare, RefreshCw, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: number;
  channel: string;
  content: string;
  schedule_time: string;
  status: string;
  created_at: string;
}

// Define Zod schemas for form validation
const postFormSchema = z.object({
  channel: z.string().min(1, "Channel is required"),
  content: z.string().min(1, "Content is required"),
  schedule_time: z.string().min(1, "Schedule time is required")
});

const promptFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  channel: z.string().min(1, "Channel is required"),
  tone: z.string().min(1, "Tone is required")
});

type PostFormValues = z.infer<typeof postFormSchema>;
type PromptFormValues = z.infer<typeof promptFormSchema>;

const SocialMediaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Setup React Hook Form for post creation
  const postForm = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      channel: '',
      content: '',
      schedule_time: ''
    }
  });

  // Setup React Hook Form for content generation
  const promptForm = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      prompt: '',
      channel: 'twitter',
      tone: 'professional'
    }
  });
  
  // Check if user has access to social media tools
  const hasAccess = user?.subscriptionPlan === 'professional' || 
                   user?.subscriptionPlan === 'enterprise' || 
                   user?.role === 'admin';

  // Fetch posts on component mount
  useEffect(() => {
    if (hasAccess) {
      fetchPosts();
    }
  }, [hasAccess]);

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await socialMediaApi.getPosts();
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch scheduled posts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const onSubmitPost = async (data: PostFormValues) => {
    setIsLoading(true);
    try {
      const response = await socialMediaApi.createPost(data);
      if (response.data) {
        toast({
          title: "Success",
          description: "Social media post scheduled successfully!",
        });
        postForm.reset();
        // Refresh posts list
        fetchPosts();
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to schedule post",
          variant: "destructive",
        });
      } else {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to schedule post",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmitPrompt = async (data: PromptFormValues) => {
    setIsGenerating(true);
    try {
      const response = await socialMediaApi.generateContent({
        prompt: data.prompt,
        channel: data.channel,
        tone: data.tone
      });
      
      if (response.data) {
        // Set the generated content to the post form
        postForm.setValue('channel', data.channel);
        postForm.setValue('content', response.data.content);
        
        toast({
          title: "Content Generated",
          description: "AI-generated content has been added to your post form",
        });
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to generate content",
          variant: "destructive",
        });
      } else {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to generate content",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Format channel name for display
  const formatChannelName = (channel: string) => {
    return channel.charAt(0).toUpperCase() + channel.slice(1);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              Social media tools require a Professional or Enterprise subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Please upgrade your subscription to access these features.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/subscription')} className="w-full">
              View Subscription Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Media</h1>
            <p className="mt-2 text-gray-600">Schedule and manage social media posts</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="create">
          <TabsList className="mb-6">
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="generate">AI Content Generator</TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled Posts
              {posts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {posts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Social Media Post</CardTitle>
                <CardDescription>
                  Create and schedule posts for your social media channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...postForm}>
                  <form onSubmit={postForm.handleSubmit(onSubmitPost)} className="space-y-4">
                    <FormField
                      control={postForm.control}
                      name="channel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel</FormLabel>
                          <CustomSelect
                            field={field}
                            options={[
                              { label: 'Twitter', value: 'twitter' },
                              { label: 'Facebook', value: 'facebook' },
                              { label: 'Instagram', value: 'instagram' },
                              { label: 'LinkedIn', value: 'linkedin' }
                            ]}
                            placeholder="Select channel"
                            className="w-full"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={postForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your post content..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          {field.value && field.value.length > 0 && 
                           postForm.getValues('channel') === 'twitter' && 
                           field.value.length > 280 && (
                            <p className="text-red-500 text-sm mt-1">
                              Twitter has a 280 character limit. Your post is {field.value.length} characters long.
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={postForm.control}
                      name="schedule_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule Time</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Post
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>AI Content Generator</CardTitle>
                <CardDescription>
                  Generate social media content with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...promptForm}>
                  <form onSubmit={promptForm.handleSubmit(onSubmitPrompt)} className="space-y-4">
                    <FormField
                      control={promptForm.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What would you like to post about?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="E.g., Announce our new product launch, Share industry insights about AI trends..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={promptForm.control}
                        name="channel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Platform</FormLabel>
                            <CustomSelect
                              field={field}
                              options={[
                                { label: 'Twitter', value: 'twitter' },
                                { label: 'Facebook', value: 'facebook' },
                                { label: 'Instagram', value: 'instagram' },
                                { label: 'LinkedIn', value: 'linkedin' }
                              ]}
                              placeholder="Select channel"
                              className="w-full"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={promptForm.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone</FormLabel>
                            <CustomSelect
                              field={field}
                              options={[
                                { label: 'Professional', value: 'professional' },
                                { label: 'Casual', value: 'casual' },
                                { label: 'Informative', value: 'informative' },
                                { label: 'Friendly', value: 'friendly' },
                                { label: 'Humorous', value: 'humorous' }
                              ]}
                              placeholder="Select tone"
                              className="w-full"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isGenerating} className="w-full">
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Scheduled Posts</CardTitle>
                  <CardDescription>
                    View and manage your scheduled social media posts
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchPosts} 
                  disabled={isLoadingPosts}
                >
                  {isLoadingPosts ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingPosts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="font-medium">
                              {formatChannelName(post.channel)}
                            </Badge>
                            <Badge className={getStatusBadgeColor(post.status)}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>
                              <Calendar className="inline-block h-4 w-4 mr-1" />
                              {new Date(post.schedule_time).toLocaleString()}
                            </span>
                            <span>
                              Created: {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No scheduled posts yet</p>
                    <p className="text-sm">Create a post to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialMediaPage;
