import { ReactNode } from "react";

type HomeTableProps = {
  headers: string[];
  children: ReactNode;
};

const HomeTable = ({ headers, children }: HomeTableProps) => (
  <div className="rounded-lg border border-neutral-200">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-neutral-200">
          {headers.map((header, i) => (
            <th
              key={header}
              className={`px-4 pb-3 pt-4 font-poppins text-sm font-semibold text-neutral-800${
                i === headers.length - 1 ? " text-right" : ""
              }`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default HomeTable;
