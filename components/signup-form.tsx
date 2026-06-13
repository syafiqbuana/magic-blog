"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signUpAction} from '@/app/action/auth'

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Fungsi untuk menangani submit form
  const handleAction = (formData: FormData) => {
    setError(null)
    
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    // Validasi client-side: Pastikan password cocok
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.")
      return
    }

    // Jalankan Server Action
    startTransition(async () => {
      const result = await signUpAction(formData)
      
      // Tampilkan error jika ada balasan error dari server
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Hubungkan form dengan fungsi handleAction */}
        <form action={handleAction}>
          <FieldGroup>
            
            {/* Tampilkan pesan error jika ada */}
            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md mb-2">
                {error}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              {/* Tambahkan atribut name="name" */}
              <Input id="name" name="name" type="text" placeholder="John Doe" required disabled={isPending} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              {/* Tambahkan atribut name="email" */}
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isPending}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              {/* Tambahkan atribut name="password" */}
              <Input id="password" name="password" type="password" required disabled={isPending} />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              {/* Tambahkan atribut name="confirm-password" */}
              <Input id="confirm-password" name="confirm-password" type="password" required disabled={isPending} />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            <FieldGroup>
              <Field>
                {/* Tampilkan status loading pada tombol */}
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login" className="underline">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}