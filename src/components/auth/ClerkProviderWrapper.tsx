import { ClerkProvider } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { ClerkKeySetup } from "@/components/auth/ClerkKeySetup";

const ENV_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
const STORAGE_KEY = "chartify.clerk_publishable_key";

function getStoredPublishableKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function ClerkProviderWithRouting({
  publishableKey,
  children,
}: {
  publishableKey: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      appearance={{
        variables: {
          colorPrimary: "hsl(228, 94%, 67%)",
          colorBackground: isDark ? "hsl(224, 21%, 12%)" : "hsl(0, 0%, 100%)",
          colorInputBackground: isDark ? "hsl(224, 21%, 9%)" : "hsl(0, 0%, 100%)",
          colorInputText: isDark ? "hsl(210, 20%, 98%)" : "hsl(220, 13%, 13%)",
          colorText: isDark ? "hsl(210, 20%, 98%)" : "hsl(220, 13%, 13%)",
          colorTextSecondary: isDark ? "hsl(220, 9%, 60%)" : "hsl(220, 9%, 46%)",
          borderRadius: "0.5rem",
        },
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
          card: "shadow-none border border-border bg-card",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "border-border hover:bg-accent text-foreground",
          formFieldLabel: "text-foreground",
          formFieldInput: "border-input bg-background text-foreground",
          footerActionLink: "text-primary hover:text-primary/90",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = ENV_PUBLISHABLE_KEY || getStoredPublishableKey() || "";

  if (!publishableKey) {
    return (
      <ClerkKeySetup
        onSave={(key) => {
          try {
            localStorage.setItem(STORAGE_KEY, key);
          } finally {
            window.location.reload();
          }
        }}
      />
    );
  }

  // NOTE: This component must be rendered inside <BrowserRouter />
  // so useNavigate() has router context.
  return (
    <ClerkProviderWithRouting publishableKey={publishableKey}>
      {children}
    </ClerkProviderWithRouting>
  );
}
