import { ReactNode } from "react";

type HomeTableProps = {
  headers: string[];
  children: ReactNode;
};

const HomeTable = ({ headers, children }: HomeTableProps) => (
  <div className="box-border flex h-full w-full flex-col justify-between overflow-y-auto rounded-lg border border-neutral-200 p-6">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-neutral-200">
          {headers.map((header, i) => (
            <th
              key={header}
              className={`px-4 pb-3 font-poppins text-[16px] font-medium leading-[140%] tracking-normal text-neutral-800${
                i === headers.length - 1 ? " w-0 whitespace-nowrap" : ""
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
