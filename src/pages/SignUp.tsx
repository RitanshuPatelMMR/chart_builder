import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Header } from "@/components/layout/Header";

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <ClerkSignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
        />
      </main>
    </div>
  );
}
