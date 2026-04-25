import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Vote, Loader2, ArrowLeft } from "lucide-react";
import { loginSchema, type LoginCredentials, type Reporter } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function ReporterLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json() as Promise<{ success: boolean; reporter: Reporter }>;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Login Successful",
          description: `Welcome, ${data.reporter.name}!`,
        });
        setLocation("/reporter/dashboard");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Election Results</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md" data-testid="reporter-login-card">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Vote className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Reporter Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the vote entry dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporter ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your reporter ID"
                          {...field}
                          data-testid="input-username"
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          data-testid="input-password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Demo Credentials</p>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Reporter ID:</span> reporter1</p>
                <p><span className="font-medium">Password:</span> password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
