'use client'

import Image from 'next/image'
import { useActionState } from 'react'
import { signUp } from '@/app/api/auth/auth'

import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react'

import { Check, RotateCcw } from 'lucide-react'

export default function SignUp() {
  const [state, action, isPending] = useActionState(signUp, null)

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
      <Card
        className="
          w-full
          max-w-md
          p-8
          border
          border-green-500/20
          bg-zinc-950
          shadow-[0_0_40px_rgba(34,197,94,0.15)]
        "
      >
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Talkar"
            width={110}
            height={110}
            priority
            className="drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          />

          <h1 className="mt-4 text-2xl font-bold text-white">
            Criar conta
          </h1>

          <p className="mt-2 text-center text-sm text-zinc-400">
            Junta-te à comunidade Talkar
          </p>
        </div>

        <Form
          className="flex flex-col gap-4"
          action={action}
        >
          <TextField isRequired name="name">
            <Label>Nome</Label>
            <Input placeholder="Insira o seu nome" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
              ) {
                return 'Por favor insira um email válido'
              }
              return null
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
          >
            <Label>Password</Label>
            <Input placeholder="Insira a sua password" />
            <Description>
              Mínimo 8 caracteres, 1 maiúscula e 1 número
            </Description>
            <FieldError />
          </TextField>

          {state?.erro && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">
                {state.erro}
              </p>
            </div>
          )}

          <div className="mt-2 flex gap-3">
            <Button
              type="submit"
              isDisabled={isPending}
              className="
                flex-1
                bg-green-500
                text-black
                font-semibold
                hover:bg-green-400
                shadow-[0_0_15px_rgba(34,197,94,0.35)]
              "
            >
              <Check size={16} />
              {isPending ? 'A registar...' : 'Registar'}
            </Button>

            <Button
              type="reset"
              variant="secondary"
            >
              <RotateCcw size={16} />
              Limpar
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
