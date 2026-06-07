"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui-toolkit/ui/button";
import { Input } from "@/ui-toolkit/ui/input";
import { Label } from "@/ui-toolkit/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui-toolkit/ui/card";
import { useAuthStore } from "@satellite-control/feature-account-auth";
import { authAdapter } from "@/lib/adapters";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, setLoading, setError, setAccount } = useAuthStore();
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const account = await authAdapter.login(username, password);
      setAccount(account);
      onSuccess?.();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm rounded-[8px] p-[16px]">
      <CardHeader>
        <CardTitle className="text-2xl">Satellite Control</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="space-y-1 mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              className="h-[40px]"
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1 mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              className="h-[40px]"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button className="w-full h-[40px]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Loading...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
