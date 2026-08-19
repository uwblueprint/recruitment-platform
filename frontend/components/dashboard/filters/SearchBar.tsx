import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search applicant",
}: SearchBarProps) => (
  <div className="flex h-9 w-64 items-center gap-2 rounded border border-neutral-200 px-3">
    <SearchIcon sx={{ fontSize: 18 }} className="text-neutral-500" />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full border-0 bg-transparent p-0 font-source text-sm text-neutral-800 outline-none focus:ring-0 placeholder:text-neutral-500"
    />
  </div>
);
