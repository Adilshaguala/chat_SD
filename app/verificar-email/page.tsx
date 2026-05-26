export default function VerificarEmail() {
  return (
    <div className="flex-1 m-auto flex items-center justify-center">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Verifica o teu email</h1>
        <p className="text-muted-foreground">
          Enviámos um link de confirmação para o teu email.
          <br />
          Clica no link para activar a tua conta.
        </p>
      </div>
    </div>
  )
}