import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MembersListSkeleton from "@/components/members-list-skeleton";
import MembersPageContent from "./members-page-content";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <Suspense fallback={<MembersListSkeleton />}>
      <MembersPageContent />
    </Suspense>
  );
}
