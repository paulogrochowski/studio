import { cookies } from "next/headers";
import { UserMenuClient } from "./user-menu-client";
import { Button } from "./ui/button";
import Link from "next/link";

export function UserMenuWrapper() {
  const authToken = cookies().get('auth-token')?.value;
  const isLoggedIn = !!authToken;

  // Placeholder for notification logic
  const notificationCount = isLoggedIn ? 2 : 0;

  if (isLoggedIn) {
      return <UserMenuClient isLoggedIn={isLoggedIn} notificationCount={notificationCount} />;
  }

  return (
    <div className="hidden sm:flex items-center gap-2">
        <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild>
            <Link href="/register">Registrar</Link>
        </Button>
    </div>
  )
}
