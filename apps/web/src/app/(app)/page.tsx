import { Header } from '@/components/header'

export default async function Home() {
  return (
    <>
      <Header />
      <main className="">
        <p className="text-muted-foreground text-sm">Selecione a organização</p>
      </main>
    </>
  )
}
