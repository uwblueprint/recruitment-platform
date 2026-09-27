import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/admin/review",
    permanent: false,
  },
});

export default function AdminRedirect() {
  return null;
}
