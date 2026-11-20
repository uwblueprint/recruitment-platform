import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/common/Button";

type StatusPageProps = {
  code: number | string;
  title: string;
  description: string;
  action?: { label: string; href: string } | { label: string; onClick: () => void };
  role?: "alert" | "status";
};

/** Shared branding, layout, and navigation for status pages and errors. */
export function StatusPage({
  code,
  title,
  description,
  action = { label: "Back to home", href: "/home" },
  role,
}: StatusPageProps) {
  return (
    <>
      <Head><title>{title} | UW Blueprint</title></Head>
      <main className="min-h-screen bg-sky-100 flex items-center justify-center p-6">
        <section role={role} className="w-full max-w-xl rounded-lg bg-white p-10 text-center shadow-lg">
          <Image src="/common/logo-blue.svg" alt="UW Blueprint" width={36} height={36} className="mx-auto" />
          <p className="font-poppins text-blue text-6xl font-semibold mt-8">{code}</p>
          <h1 className="font-poppins text-2xl font-semibold mt-4">{title}</h1>
          <p className="font-source text-neutral-600 my-6">{description}</p>
          {"href" in action ? (
            <Button href={action.href}>{action.label}</Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </section>
      </main>
    </>
  );
}
