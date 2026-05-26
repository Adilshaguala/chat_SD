'use client'

import { useActionState } from 'react'
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
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default function Login() {
  const [state, action, isPending] = useActionState(signIn, null)

  return (
    <div className="flex-1 m-auto flex items-center justify-center">
      <Card className="w-fit" variant="secondary">
        <Form className="flex w-96 flex-col gap-4" action={action}>

          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>

          <TextField isRequired name="password" type="password">
            <Label>Password</Label>
            <Input placeholder="Insira a sua password" />
            <FieldError />
          </TextField>

          {state?.erro && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-red-500">{state.erro}</p>
              {state?.emailNaoConfirmado && (
                <Link
                  href="/reenviar-confirmacao"
                  className="text-sm underline text-muted-foreground"
                >
                  Reenviar email de confirmação
                </Link>
              )}
            </div>
          )}

          <Button type="submit" isDisabled={isPending}>
            <LogIn size={16} />
            {isPending ? 'A entrar...' : 'Entrar'}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Não tens conta?{' '}
            <Link href="/signup" className="underline">
              Registar
            </Link>
          </p>

        </Form>
      </Card>
    </div>
  )
}