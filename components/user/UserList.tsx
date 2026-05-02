"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Props {
  users: User[];
}

export function UserList({ users }: Props) {
  return (
    <div className="grid gap-3">
      {users.map((user) => (
        <Link key={user.id} href={`/dashboard/users/${user.id}/edit`}>
          <Card className="hover:bg-muted transition cursor-pointer">
            <CardContent className="p-4 flex justify-between">

              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <span className="text-xs text-muted-foreground">
                {user.company}
              </span>

            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
