import { AuthLoginForm } from "~/components/auth-login-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthLoginForm />
      </div>
    </div>
  );
}