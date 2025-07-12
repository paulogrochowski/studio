import { cookies } from "next/headers";
import { UserMenuClient } from "./user-menu-client";

export function UserMenuWrapper() {
  const authToken = cookies().get('auth-token')?.value;
  const isLoggedIn = !!authToken;

  // Placeholder for notification logic
  const notificationCount = isLoggedIn ? 2 : 0;
  
  return <UserMenuClient isLoggedIn={isLoggedIn} notificationCount={notificationCount} />;
}
