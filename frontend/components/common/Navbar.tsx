import { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { NavbarPopover } from "@/components/common/NavbarPopover";
import { NavbarPopoverItem } from "@/components/common/NavbarPopoverItem";
import { BlueprintWordmark } from "@/components/common/BlueprintWordmark";
import { useRouter } from "next/router";
import useLogout from "@/APIClients/mutations/useLogout";
import { useAuthUserContext, useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { UserIcon } from "@/components/icons/user.icon";
import { LogoutIcon } from "@/components/icons/logout.icon";
import { ArrowDownIcon } from "@/components/icons/arrow-down.icon";

interface NavbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const RECRUITMENT_DEPARTMENTS = [
  "Community",
  "Product",
  "Design",
  "Engineering",
];

const NavbarButton = ({ children, ...props }: NavbarButtonProps) => (
  <button
    {...props}
    type="button"
    className="flex items-center gap-2 whitespace-nowrap font-poppins text-base font-medium leading-6 text-neutral-800 hover:text-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
  >
    {children}
  </button>
);

export const Navbar = () => {
  const [recruitmentAnchor, setRecruitmentAnchor] = useState<HTMLButtonElement | null>(null);
  const [profileAnchor, setProfileAnchor] = useState<HTMLButtonElement | null>(null);
  const closeMenus = () => {
    setRecruitmentAnchor(null);
    setProfileAnchor(null);
  };
  const { logout } = useAuthUserContext();
  const { mutate: logoutMutation } = useLogout();
  const authenticatedUser = useAuthenticatedUser();
  const userName = authenticatedUser
    ? `${authenticatedUser.firstName} ${authenticatedUser.lastName.charAt(0)}`
    : "User";
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setRecruitmentAnchor(null);
      setProfileAnchor(null);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  const handleLogout = async () => {
    closeMenus();
    try {
      if (authenticatedUser?.id) {
        await logoutMutation({
          variables: { userId: authenticatedUser.id }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <nav aria-label="Admin navigation" className="sticky top-0 z-50 flex h-[72px] w-full shrink-0 items-center justify-between gap-6 bg-blue-50 px-6">
      
      <div className="flex items-center gap-6">
        <Link href="/admin/review" className="mr-10 shrink-0" aria-label="Blueprint admin home">
          <BlueprintWordmark />
        </Link>

        <div className="relative">
          <NavbarButton
            aria-expanded={Boolean(recruitmentAnchor)}
            aria-controls={recruitmentAnchor ? "recruitment-popover" : undefined}
            onClick={(event) => setRecruitmentAnchor(event.currentTarget)}
          >
            Recruitment
            <ArrowDownIcon className="h-2 w-3" />
          </NavbarButton>

          <NavbarPopover
            id="recruitment-popover"
            anchorEl={recruitmentAnchor}
            onClose={closeMenus}
          >
            <div className="py-1.5">
              {RECRUITMENT_DEPARTMENTS.map((department) => {
                const isSelected = router.query.department === department;

                return (
                  <NavbarPopoverItem
                    key={department}
                    href={{
                      pathname: "/admin/review",
                      query: { department },
                    }}
                    isSelected={isSelected}
                    onClick={closeMenus}
                  >
                    {department}
                  </NavbarPopoverItem>
                );
              })}
            </div>
          </NavbarPopover>
        </div>

        <Link href="/admin/management" className="whitespace-nowrap font-poppins text-base font-medium leading-6 text-neutral-800 hover:text-blue-500">
          Management
        </Link>

        <Link href="/admin/interview-invites" className="whitespace-nowrap font-poppins text-base font-medium leading-6 text-neutral-800 hover:text-blue-500">
          Interview invite
        </Link>
      </div>

      <div className="relative">
        <NavbarButton
          aria-expanded={Boolean(profileAnchor)}
          aria-controls={profileAnchor ? "profile-popover" : undefined}
          onClick={(event) => setProfileAnchor(event.currentTarget)}
        >
          <UserIcon className="mr-1 h-6 w-6" />
          <span>{userName}</span>
          <ArrowDownIcon className="h-2 w-3" />
        </NavbarButton>

        <NavbarPopover
          id="profile-popover"
          anchorEl={profileAnchor}
          onClose={closeMenus}
          align="right"
        >
          <div className="py-1.5">
            <NavbarPopoverItem onClick={closeMenus}>
              My Profile
            </NavbarPopoverItem>
            <NavbarPopoverItem href="/home" onClick={closeMenus}>
              Switch to Review
            </NavbarPopoverItem>
            <NavbarPopoverItem onClick={handleLogout}>
              <LogoutIcon className="w-4 h-4" />
              Logout
            </NavbarPopoverItem>
          </div>
        </NavbarPopover>
      </div>
    </nav>
  );
};
