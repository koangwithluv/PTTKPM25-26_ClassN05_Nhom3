import MainSidebar from '../../components/main-sidebar'

export default function TinhTienDayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
