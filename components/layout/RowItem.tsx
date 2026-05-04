"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

interface RowItemProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  asChild?: boolean;
}

export function RowItem({
  left,
  right,
  children,
  onClick,
  asChild,
}: RowItemProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      onClick={onClick}
      className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/40 transition cursor-pointer"
    >
      {children ? (
        children
      ) : (
        <>
          <div>{left}</div>
          {right && <div>{right}</div>}
        </>
      )}
    </Comp>
  );
}
