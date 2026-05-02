"use client";

import { RowItem } from "@/components/layout/RowItem";

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
}

export function UserRow({ name, email, company }: User) {
  return (
    <RowItem
      left={
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      }
      right={
        <span className="text-sm text-muted-foreground">
          {company}
        </span>
      }
    />
  );
}
