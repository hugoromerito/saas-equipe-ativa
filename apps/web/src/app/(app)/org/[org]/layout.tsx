import { Header } from '@/components/header'
// import { Tabs } from '@/components/tabs'

export default function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <div>
    //   <div className="">
    //     <Header />
    //     <Tabs />
    //   </div>

    <main className="">{children}</main>
    // </div>
  )
}
