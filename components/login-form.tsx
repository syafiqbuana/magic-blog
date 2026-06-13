'use client';

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/action/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useParams();
  const pathname = usePathname();

  let portalSlug = "universal";
  if (params?.slug) {
    portalSlug = params.slug as string;
  } else if (pathname?.startsWith("/superadmin")) {
    portalSlug = "superadmin";
  }

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    setError(null); // Reset error setiap kali form di-submit

    // Ekstraksi email dan password dihapus karena tidak terpakai
    
    startTransition(async () => {
      const result = await loginAction(formData);
      
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleAction}>
            <input type="hidden" name="portalSlug" value={portalSlug} />
            
            {/* BLOK TAMPILAN ERROR */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-xs text-red-500 border border-red-200">
                {error}
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  disabled={isPending} // Nonaktifkan input saat loading
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  name="password" 
                  disabled={isPending} // Nonaktifkan input saat loading
                />
              </Field>
              <Field>
                {/* TOMBOL MENGGUNAKAN isPending */}
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}