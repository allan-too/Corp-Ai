
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { marketingApi } from '../../api/toolsApi';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  audiences: z.array(z.string()).min(1, 'Select at least one audience'),
});

const AUDIENCE_OPTIONS = [
  { id: 'new_customers', label: 'New Customers' },
  { id: 'returning_customers', label: 'Returning Customers' },
  { id: 'premium_users', label: 'Premium Users' },
  { id: 'inactive_users', label: 'Inactive Users' },
  { id: 'enterprise', label: 'Enterprise Clients' },
];

const CampaignForm = ({ onCampaignCreated }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      message: '',
      audiences: [],
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await marketingApi.createCampaign(data);
      toast({
        title: "Success",
        description: "Campaign sent successfully!",
      });
      form.reset();
      onCampaignCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Marketing Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your marketing message"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="audiences"
              render={() => (
                <FormItem>
                  <FormLabel>Target Audiences</FormLabel>
                  <div className="space-y-3">
                    {AUDIENCE_OPTIONS.map((audience) => (
                      <FormField
                        key={audience.id}
                        control={form.control}
                        name="audiences"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={audience.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(audience.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, audience.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== audience.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {audience.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Sending Campaign...' : 'Send Campaign'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
