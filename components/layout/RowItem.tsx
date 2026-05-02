"use client";

export function RowItem({
  left,
  right,
  onClick,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/40 transition cursor-pointer"
    >
      <div>{left}</div>
      {right && <div>{right}</div>}
    </div>
  );
}
