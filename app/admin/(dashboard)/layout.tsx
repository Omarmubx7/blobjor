import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AdminSidebar admin={admin} />
      <div className="lg:pr-64">
        <AdminHeader admin={admin} />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
