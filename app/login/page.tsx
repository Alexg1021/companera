import { Suspense } from "react";
import LoginForm from "./ui";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-phone items-center justify-center text-sm text-neutral-500">
          Cargando…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
