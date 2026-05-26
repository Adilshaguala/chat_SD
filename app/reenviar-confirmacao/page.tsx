'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react'

export default function ReenviarConfirmacao() {
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const email = new FormData(e.currentTarget).get('email') as string
    const supabase = createClient()

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      setErro(error.message)
      return
    }

    setErro(null)
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">✅</div>

          <h2 className="mb-2 text-2xl font-bold">
            Email reenviado!
          </h2>

          <p className="mb-6 text-default-500">
            Verifica a tua caixa de entrada e segue as instruções para
            confirmar a conta.
          </p>

          <Button
            // color="primary"
            size="lg"
            className="w-full"
            onPress={() => router.push('/auth/login')}
          >
            OK
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Reenviar confirmação
        </h1>

        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
          </TextField>

          {erro && (
            <p className="rounded-md bg-danger-50 p-3 text-sm text-danger">
              {erro}
            </p>
          )}

          <Button
            type="submit"
            // color="primary"
            className="w-full"
          >
            Reenviar email
          </Button>
        </Form>
      </Card>
    </div>
  )
}