"use client";

import Link from "next/link";
import { UserRow, User } from "./UserRow";

interface Props {
  data: User[];
}

export function UserList({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum usuário encontrado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((user) => (
        <Link
          key={user.id}
          href={`/dashboard/users/${user.id}/edit`}
          className="block"
        >
          <UserRow {...user} />
        </Link>
      ))}
    </div>
  );
}
