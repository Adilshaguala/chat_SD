'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useActionState } from 'react'
import { LogIn } from 'lucide-react'

import { signIn } from '@/app/api/auth/auth'

import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react'

export default function Login() {
  const [state, action, isPending] = useActionState(signIn, null)

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
      <Card
        className="
          w-full
          max-w-md
          border
          border-green-500/20
          bg-zinc-950/90
          p-8
          shadow-[0_0_40px_rgba(34,197,94,0.15)]
          backdrop-blur-md
        "
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <Image
              src="/images/logo.png"
              alt="Talkar"
              width={300}
              height={300}
              priority
              className="drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]"
            />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Bem-vindo de volta
          </h1>

          <p className="mt-2 text-center text-sm text-zinc-400">
            Entre na sua conta para continuar
          </p>
        </div>

        <Form
          className="flex flex-col gap-5"
          action={action}
        >
          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input
              placeholder="john@example.com"
              className="bg-zinc-900 border border-zinc-800 hover:border-green-500/50"
            />
            <FieldError />
          </TextField>

          <TextField isRequired name="password" type="password">
            <Label>Password</Label>
            <Input
              placeholder="Insira a sua password"
              className="bg-zinc-900 border border-zinc-800 hover:border-green-500/50"
            />
            <FieldError />
          </TextField>

          {state?.erro && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">
                {state.erro}
              </p>

              {state?.emailNaoConfirmado && (
                <Link
                  href="/reenviar-confirmacao"
                  className="
                    mt-2
                    block
                    text-sm
                    text-green-400
                    underline-offset-4
                    hover:underline
                  "
                >
                  Reenviar email de confirmação
                </Link>
              )}
            </div>
          )}

          <Button
            type="submit"
            isDisabled={isPending}
            size="lg"
            className="
              mt-2
              bg-green-500
              font-semibold
              text-black
              transition-all
              hover:scale-[1.02]
              hover:bg-green-400
              shadow-[0_0_20px_rgba(34,197,94,0.4)]
            "
          >
            <LogIn size={18} />
            {isPending ? 'A entrar...' : 'Entrar'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-zinc-400">
              Não tens conta?{' '}
              <Link
                href="/auth/signup"
                className="
                  font-medium
                  text-green-400
                  hover:text-green-300
                "
              >
                Registar
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  )
}