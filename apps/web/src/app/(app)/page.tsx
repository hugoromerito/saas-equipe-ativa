import { Header } from '@/components/header'
import { OrgList } from './org-list'

export default async function Home() {
  return (
    <>
      <Header />
      <main className="">
        <OrgList />
      </main>
    </>
  )
}
