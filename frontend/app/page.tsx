import { getHealth } from "@/lib/api";

export default async function HomePage() {
  let backendStatus = "offline";

  try {
    const data = await getHealth();
    backendStatus = data.status;
  } catch (error) {
    backendStatus = "unreachable";
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-neutral-400">
          Workgrid
        </p>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Organize work with clarity.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
          Workgrid is a lightweight board-based project management app for
          organizing tasks, lists and team workflows.
        </p>

        <div className="mt-8 inline-flex w-fit items-center rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300">
          Backend status: <span className="ml-2 font-medium text-white">{backendStatus}</span>
        </div>
      </section>
    </main>
  );
}