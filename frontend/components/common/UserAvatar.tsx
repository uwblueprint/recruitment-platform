import { Avatar } from "@mui/material";
import { UserIcon } from "@/components/icons/user.icon";

type UserAvatarProps = {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  size?: number;
};

/** MUI handles failed images and retries when the photo URL changes. */
export const UserAvatar = ({
  firstName,
  lastName,
  photoUrl,
  size = 42,
}: UserAvatarProps) => {
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim() || "User";

  return (
    <Avatar
      src={photoUrl || undefined}
      alt={name}
      role="img"
      aria-label={name}
      className="!bg-surface-highlight !text-neutral-800"
      imgProps={{ loading: "lazy", decoding: "async", alt: "" }}
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        fontSize: size <= 24 ? 10 : 14,
        fontFamily: "Poppins, sans-serif",
        fontWeight: 500,
      }}
    >
      {initials || <UserIcon className="h-3/5 w-3/5" />}
    </Avatar>
  );
};
