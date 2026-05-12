"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type NotificationListItem = {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
  member_id: string;
  member_name: string;
};

type Props = {
  initial: NotificationListItem[];
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationListClient({ initial }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  async function markRead(id: string) {
    const res = await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (!res.ok) return;
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-neutral-500">
        No hay alertas. Las escalaciones aparecerán aquí cuando las registres desde un contacto.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {items.map((n) => (
        <li key={n.id} className={`px-4 py-3 ${n.read ? "bg-white" : "bg-amber-50/40"}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-neutral-400">{formatWhen(n.created_at)}</p>
              <p className="mt-1 text-xs font-medium text-neutral-900">{n.member_name}</p>
              <p className="mt-1 text-sm leading-snug text-neutral-700">{n.message}</p>
              <Link href={`/members/${n.member_id}`} className="mt-2 inline-block text-xs text-brand">
                Ver perfil →
              </Link>
            </div>
            {!n.read && (
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className="shrink-0 rounded-lg border border-neutral-200 px-2 py-1 text-[10px] text-neutral-700 hover:bg-white"
              >
                Marcar leída
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
