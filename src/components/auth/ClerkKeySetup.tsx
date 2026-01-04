import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClerkKeySetupProps {
  onSave: (publishableKey: string) => void;
}

export function ClerkKeySetup({ onSave }: ClerkKeySetupProps) {
  const [key, setKey] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Connect Clerk</CardTitle>
          <CardDescription>
            Paste your Clerk <span className="font-medium">Publishable Key</span> (starts with
            <span className="font-mono"> pk_</span>). This is safe to use in the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="clerk-pk">
              Publishable Key
            </label>
            <Input
              id="clerk-pk"
              placeholder="pk_test_..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
            />
          </div>

          <Button
            className="w-full"
            onClick={() => onSave(key.trim())}
            disabled={!key.trim().startsWith("pk_")}
          >
            Save & Reload
          </Button>

          <p className="text-xs text-muted-foreground">
            If you prefer, you can also provide the key via an environment variable named
            <span className="font-mono"> VITE_CLERK_PUBLISHABLE_KEY</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
