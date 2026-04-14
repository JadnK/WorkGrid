export default function HomePage() {
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

        <div className="mt-8 flex gap-4">
          <button className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90">
            Create board
          </button>
          <button className="rounded-xl border border-neutral-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-900">
            View demo
          </button>
        </div>
      </section>
    </main>
  );
}