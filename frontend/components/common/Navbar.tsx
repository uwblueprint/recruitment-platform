import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { client } from "@/client";
import { LogoutDocument } from "@/graphql/typeUtils";
import { useAuthUserContext, useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { UserIcon } from "@/components/icons/user.icon";
import { LogoutIcon } from "@/components/icons/logout.icon";
import { ChevronDownIcon } from "@/components/icons/arrow-down.icon";

interface NavbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const NavbarButton: FC<NavbarButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="flex items-center gap-2 text-sm font-poppins font-medium text-neutral-600 hover:text-blue-500 focus:outline-none"
  >
    {children}
  </button>
);

export const Navbar: FC = () => {
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { setAuthenticatedUser } = useAuthUserContext();
  const authenticatedUser = useAuthenticatedUser();
  const userName = authenticatedUser
    ? `${authenticatedUser.firstName} ${authenticatedUser.lastName}`
    : "User";
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (authenticatedUser?.id) {
        await client.mutate({
          mutation: LogoutDocument,
          variables: { userId: authenticatedUser.id }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAuthenticatedUser(null);
      router.push("/login");
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-blue-50 border-b border-neutral-100 w-full sticky top-0 z-50">
      
      <div className="flex items-center gap-8">
        <Link href="/admin/review">
          <Image
            src="common/review-page-banner.svg"
            alt="Blueprint Logo"
            width={100}
            height={40}
          />
        </Link>

        <div className="relative">
          <NavbarButton onClick={() => setRecruitmentOpen(!recruitmentOpen)}>
            Recruitment
            <ChevronDownIcon />
          </NavbarButton>

          {recruitmentOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-100 rounded shadow-md">
              <Link href="/admin/review?department=Community" className="block px-4 py-2 text-sm font-poppins text-neutral-600 hover:bg-blue-50">
                Community
              </Link>
              <Link href="/admin/review?department=Product" className="block px-4 py-2 text-sm font-poppins text-neutral-600 hover:bg-blue-50">
                Product
              </Link>
              <Link href="/admin/review?department=Design" className="block px-4 py-2 text-sm font-poppins text-neutral-600 hover:bg-blue-50">
                Design
              </Link>
              <Link href="/admin/review?department=Engineering" className="block px-4 py-2 text-sm font-poppins text-neutral-600 hover:bg-blue-50">
                Engineering
              </Link>
            </div>
          )}
        </div>

        <Link href="/admin/management" className="text-sm font-poppins font-medium text-neutral-600 hover:text-blue-500">
          Management
        </Link>

        <Link href="/admin/interview-invites" className="text-sm font-poppins font-medium text-neutral-600 hover:text-blue-500">
          Interview Invites
        </Link>
      </div>

      <div className="relative">
        <NavbarButton onClick={() => setProfileOpen(!profileOpen)}>
          <UserIcon className="w-5 h-5" />
          <span>{userName}</span>
          <ChevronDownIcon />
        </NavbarButton>

        {profileOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-neutral-100 rounded shadow-md w-48">
            <button className="block w-full text-left px-4 py-2 text-sm font-poppins text-neutral-600 hover:bg-blue-50">
              My Profile
            </button>
            <Link href="/home" className="block px-4 py-2 text-sm font-poppins text-neutral-600 hover:bg-blue-50">
              Switch to Review
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-poppins text-neutral-600 hover:bg-blue-50"
            >
              <LogoutIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};