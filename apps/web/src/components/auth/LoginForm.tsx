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

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, setLoading, setError, setAccount } = useAuthStore();
  const router = useRouter();

  async function handleSubmit() {
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Satellite Control</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </CardContent>
    </Card>
  );
}
