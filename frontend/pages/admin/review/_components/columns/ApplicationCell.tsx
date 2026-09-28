type ApplicationCellProps = {
  applicantName: string;
};

export const ApplicationCell = ({ applicantName }: ApplicationCellProps) => (
  <span className="border-b border-neutral-800 text-neutral-800">
    {applicantName}
  </span>
);
