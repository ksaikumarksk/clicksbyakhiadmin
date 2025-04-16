// import AdminPanel from "@/components/admin-panel"

import AdminPanel from "./componnents/admin-panel";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Product Admin Panel</h1>
      <AdminPanel />
    </main>
  )
}
