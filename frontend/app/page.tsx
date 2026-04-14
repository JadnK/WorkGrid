import { getBoards, getHealth } from "@/lib/api";

export default async function HomePage() {
  let backendStatus = "offline";
  let boards: { id: string; title: string }[] = [];

  try {
    const health = await getHealth();
    backendStatus = health.status;
  } catch {}

  try {
    boards = await getBoards();
  } catch {}

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-neutral-400">
          Workgrid
        </p>

        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Your boards
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300">
              A simple collaborative workspace for boards, lists and cards.
            </p>
          </div>

          <div className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300">
            Backend: <span className="ml-2 font-medium text-white">{backendStatus}</span>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <article
              key={board.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
            >
              <h2 className="text-lg font-medium text-white">{board.title}</h2>
              <p className="mt-2 text-sm text-neutral-400">
                Open board and manage tasks.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}