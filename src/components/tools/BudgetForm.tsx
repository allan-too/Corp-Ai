
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { financeApi } from '../../api/toolsApi';

const budgetSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  revenue: z.number().min(0, 'Revenue must be positive'),
  expenses: z.number().min(0, 'Expenses must be positive'),
});

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(142, 76%, 36%)",
  },
  expenses: {
    label: "Expenses", 
    color: "hsl(0, 84%, 60%)",
  },
  surplus: {
    label: "Surplus",
    color: "hsl(217, 91%, 60%)",
  },
};

const BudgetForm = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7), // YYYY-MM format
      revenue: 0,
      expenses: 0,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await financeApi.createBudget(data);
      setBudgetData(response.data);
      toast({
        title: "Success",
        description: "Budget plan created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create budget",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const watchedValues = form.watch();
  const surplus = watchedValues.revenue - watchedValues.expenses;

  const chartData = budgetData ? [
    {
      category: 'Financial Overview',
      revenue: budgetData.revenue,
      expenses: budgetData.expenses,
      surplus: budgetData.surplus,
    }
  ] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Revenue ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Expenses ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={`p-4 rounded-lg ${surplus >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="text-sm font-medium">Projected Surplus/Deficit:</div>
                <div className={`text-2xl font-bold ${surplus >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${surplus.toLocaleString()}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating Budget...' : 'Create Budget Plan'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {budgetData && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" />
                  <Bar dataKey="surplus" fill="var(--color-surplus)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Revenue</div>
                <div className="text-xl font-bold text-green-600">
                  ${budgetData.revenue?.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Expenses</div>
                <div className="text-xl font-bold text-red-600">
                  ${budgetData.expenses?.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Net</div>
                <div className={`text-xl font-bold ${budgetData.surplus >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ${budgetData.surplus?.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetForm;
