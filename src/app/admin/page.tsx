import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  // Jika tidak ada session (cookie tidak ditemukan), paksa render form login
  if (!session || session.value !== "authenticated") {
    return <LoginForm />;
  }

  // Jika session valid, render dashboard
  return <AdminDashboard />;
}
