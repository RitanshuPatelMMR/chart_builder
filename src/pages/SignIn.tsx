import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Header } from "@/components/layout/Header";

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <ClerkSignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
        />
      </main>
    </div>
  );
}
