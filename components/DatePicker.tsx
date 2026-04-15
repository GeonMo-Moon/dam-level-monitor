"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format, subDays } from "date-fns";

export default function DatePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = format(new Date(), "yyyy-MM-dd");
  const selected = searchParams.get("date") ?? today;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== today) {
      params.set("date", val);
    } else {
      params.delete("date");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 text-sm ml-auto">
      <span className="text-gray-500 hidden sm:inline">날짜</span>
      <input
        type="date"
        value={selected}
        max={today}
        min={format(subDays(new Date(), 30), "yyyy-MM-dd")}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
