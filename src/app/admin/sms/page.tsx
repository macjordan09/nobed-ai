import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSms() {
  const logs = await prisma.smsLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold">SMS command log ({logs.length})</h3>
        <p className="text-xs text-slate-500">
          Every short-code command is logged for compliance and abuse monitoring.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Command</th>
              <th className="px-4 py-2">Response</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-400">
                  {new Date(l.createdAt).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-2 font-mono text-xs">{l.phoneNumber}</td>
                <td className="px-4 py-2 font-mono text-xs">{l.command}</td>
                <td className="px-4 py-2 max-w-md text-slate-600">{l.response}</td>
                <td className="px-4 py-2">
                  <span
                    className={`pill ${
                      l.status === "OK"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
