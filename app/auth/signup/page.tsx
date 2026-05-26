'use client'

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
    <div className="flex-1 m-auto flex items-center justify-center">
      <Card className="w-fit" variant="secondary">
        <Form className="flex w-96 flex-col gap-4" action={action}>

          <TextField
            isRequired
            name="name"
          >
            <Label>Nome</Label>
            <Input placeholder="Insira o seu nome" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
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
            validate={(value) => {
            //   if (value.length < 8) return 'Mínimo 8 caracteres'
            //   if (!/[A-Z]/.test(value)) return 'Precisa de pelo menos uma letra maiúscula'
            //   if (!/[0-9]/.test(value)) return 'Precisa de pelo menos um número'
            //   return null
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Insira a sua password" />
            <Description>Mínimo 8 caracteres, 1 maiúscula e 1 número</Description>
            <FieldError />
          </TextField>

          {/* Erro vindo do servidor (ex: email já existe) */}
          {state?.erro && (
            <p className="text-sm text-red-500">{state.erro}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" isDisabled={isPending}>
              <Check size={16} />
              {isPending ? 'A registar...' : 'Registar'}
            </Button>
            <Button type="reset" variant="secondary">
              <RotateCcw size={16} />
              Limpar
            </Button>
          </div>

        </Form>
      </Card>
    </div>
  )
}