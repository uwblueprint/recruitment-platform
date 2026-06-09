import { FC, useState } from "react";
import Link from "next/link";
import { BlueprintLogo } from "./BlueprintLogo";
import { useAuthUserContext, useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { useRouter } from "next/router";

export const Navbar: FC = () => {
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuthUserContext();
  const authenticatedUser = useAuthenticatedUser();
  const userName = authenticatedUser
    ? `${authenticatedUser.firstName} ${authenticatedUser.lastName}`
    : "User";
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <Link href="/admin/review">
        <BlueprintLogo />
      </Link>

      <div className="flex items-center gap-8">
        <div className="relative">
          <button
            onClick={() => setRecruitmentOpen(!recruitmentOpen)}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Recruitment
            <span>▾</span>
          </button>

          {recruitmentOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-md">
              <Link href="/admin/review?department=Community" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Community
              </Link>
              <Link href="/admin/review?department=Product" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Product
              </Link>
              <Link href="/admin/review?department=Design" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Design
              </Link>
              <Link href="/admin/review?department=Engineering" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Engineering
              </Link>
            </div>
          )}
        </div>

        <Link href="/admin/management" className="text-sm font-medium text-gray-700 hover:text-blue-600">
          Management
        </Link>

        <Link href="/admin/interview-invites" className="text-sm font-medium text-gray-700 hover:text-blue-600">
          Interview Invites
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          <span>{userName}</span>
          <span>▾</span>
        </button>

        {profileOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-md w-40">
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              My Profile
            </button>
            <Link href="/home" className="block px-4 py-2 text-sm hover:bg-gray-100">
              Review
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};