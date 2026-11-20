import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/common/Button";

export default function PermissionDeniedPage() {
  return (
    <>
      <Head><title>Permission denied | UW Blueprint</title></Head>
      <main className="min-h-screen bg-sky-100 flex items-center justify-center p-6">
        <section className="w-full max-w-xl rounded-lg bg-white p-10 text-center shadow-lg">
          <Image src="/common/logo-blue.svg" alt="UW Blueprint" width={36} height={36} className="mx-auto" />
          <p className="font-poppins text-blue-100 text-6xl font-semibold mt-8">503</p>
          <h1 className="font-poppins text-2xl font-semibold mt-4">Permission denied</h1>
          <p className="font-source text-neutral-600 my-6">You don’t have permission to access this page. If you should be assigned to this review, please contact an administrator.</p>
          <Button href="/home">Back to home</Button>
        </section>
      </main>
    </>
  );
}
