import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";

interface Donation {
  donor: string;
  address: string;
  amount: string;
  usd: string;
  cause: string;
  date: string;
  time: string;
  hash: string;
  status: string;
}

export const DonationTable = ({ data }: { data: Donation[] }) => {
  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="text-xs font-bold uppercase">Donor</TableHead>
          <TableHead className="text-xs font-bold uppercase">Amount</TableHead>
          <TableHead className="text-xs font-bold uppercase">Cause / Campaign</TableHead>
          <TableHead className="text-xs font-bold uppercase">Timestamp</TableHead>
          <TableHead className="text-xs font-bold uppercase">Tx Hash</TableHead>
          <TableHead className="text-xs font-bold uppercase text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                  {row.donor.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{row.donor}</div>
                  <div className="text-xs text-slate-400">{row.address}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-bold">{row.amount}</div>
              <div className="text-xs text-emerald-500">{row.usd}</div>
            </TableCell>
            <TableCell className="text-sm text-slate-600">{row.cause}</TableCell>
            <TableCell>
              <div className="text-sm font-medium">{row.date}</div>
              <div className="text-xs text-slate-400">{row.time}</div>
            </TableCell>
            <TableCell className="text-indigo-500 font-mono text-xs">{row.hash}</TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
                <span  className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                {row.status}
              </Badge >
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};