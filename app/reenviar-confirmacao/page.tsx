'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button, Card, Form, Input, Label, TextField } from '@heroui/react'

export default function ReenviarConfirmacao() {
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email') as string
    const supabase = createClient()

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) return setErro(error.message)
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="flex-1 m-auto flex items-center justify-center">
        <p className="text-center">Email reenviado. Verifica a tua caixa de entrada.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 m-auto flex items-center justify-center">
      <Card className="w-fit" variant="secondary">
        <Form className="flex w-96 flex-col gap-4" onSubmit={handleSubmit}>

          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
          </TextField>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <Button type="submit">Reenviar email</Button>

        </Form>
      </Card>
    </div>
  )
}