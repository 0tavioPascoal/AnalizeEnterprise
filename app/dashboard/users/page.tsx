import { getUsers } from "@/actions/user/getUser";
import { UsersClient } from "@/components/user/UsersClient";

export default async function UsersPage() {
  const users = await getUsers();

  return <UsersClient users={users} />;
}