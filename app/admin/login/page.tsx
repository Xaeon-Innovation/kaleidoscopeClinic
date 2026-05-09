export const metadata = {
  title: "Admin login",
};

export default function AdminLoginPage() {
  // Imported dynamically to keep this file a Server Component (metadata-friendly).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { AdminLoginForm } = require("@/components/admin/AdminLoginForm") as {
    AdminLoginForm: React.ComponentType;
  };
  return <AdminLoginForm />;
}

