"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function DisplaySelect({ perPage }: { perPage: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const options = [20, 40, 60, 80, 100, 120, 140, 160, 200];

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const sp = new URLSearchParams(params.toString());
    sp.set("display", value);
    router.push(`?${sp.toString()}`);
  }

  return (
    <select
      className="h-9 rounded border px-2 text-sm bg-white"
      onChange={onChange}
      value={perPage}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
