/** Stable avatar colors per style guide — index from member id or list index. */
export const AVATAR_COLOR_CLASSES = [
  "bg-[#FAECE7] text-[#712B13]",
  "bg-[#FAEEDA] text-[#633806]",
  "bg-[#EEEDFE] text-[#3C3489]",
  "bg-[#E6F1FB] text-[#0C447C]",
  "bg-[#FBEAF0] text-[#72243E]",
  "bg-brand-teal-light text-brand-teal-dark",
] as const;

export function avatarColorIndexFromMemberId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % AVATAR_COLOR_CLASSES.length;
}

export function avatarClassForMemberId(id: string): string {
  return AVATAR_COLOR_CLASSES[avatarColorIndexFromMemberId(id)];
}

export function avatarClassForListIndex(index: number): string {
  return AVATAR_COLOR_CLASSES[index % AVATAR_COLOR_CLASSES.length];
}
