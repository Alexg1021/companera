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
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-400" aria-hidden>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.082A2.25 2.25 0 0021.75 14v-5.25A2.25 2.25 0 0019.5 6.75h-2.035a23.848 23.848 0 00-3.536-1.082M14.857 17.082L12 15.75m-2.857 1.332l-.786.262M12 15.75l.786-.262m0 0l3.75-1.25m-3.75 1.25l-3.75-1.25m0 0l-1.286-.429m1.286.429L9 12.75m-3.75 1.25h9.75" />
          </svg>
        </div>
        <p className="text-sm text-neutral-600">Sin alertas pendientes.</p>
      </div>
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
