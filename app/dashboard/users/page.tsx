import { getUsers } from "@/features/users/server/get-users";
import { UsersClient } from "@/features/users/components/UsersClient";

export default async function UsersPage() {
  const users = await getUsers();

  return <UsersClient users={users} />;
}