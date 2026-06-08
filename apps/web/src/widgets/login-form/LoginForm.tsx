"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/ui/button";
import { Input } from "@/shared/ui/ui/input";
import { Label } from "@/shared/ui/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/ui/card";
import { useAuthStore } from "@satellite-control/feature-account-auth";
import { authAdapter } from "@/shared/config/adapters";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const t = useTranslations("auth");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, setLoading, setError, setAccount } = useAuthStore();
  const router = useRouter();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!username || !password) {
      setError(t("errorRequired"));
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
      setError(err instanceof Error ? err.message : t("errorFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm rounded-[8px] p-[16px]">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="space-y-1 mb-4">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              className="h-[40px]"
              id="username"
              type="text"
              placeholder={t("usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1 mb-4">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              className="h-[40px]"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button className="w-full h-[40px]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> {t("loading")}
              </>
            ) : (
              t("signIn")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
