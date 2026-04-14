import Link from "next/link";
import { getProjectById } from "@/lib/api";

type ProjectDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailsPage({
  params
}: ProjectDetailsPageProps) {
  const { id } = await params;

  let project = null;

  try {
    project = await getProjectById(id);
  } catch {
    project = null;
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#0a0c0f] text-white">
        <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-5 sm:py-10">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm text-white/50 transition hover:text-white/80"
          >
            ← Back
          </Link>

          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Project not found
            </h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0c0f] text-white">
        <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-5 sm:py-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-white/50 transition hover:text-white/80"
        >
          ← Back
        </Link>

        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] text-sm font-medium text-white/70">
            WG
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/30">
                Project
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {project.title}
              </h1>
            </div>

            {project.description ? (
              <div className="max-w-2xl">
                <p className="text-[15px] leading-7 text-white/55">
                  {project.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-white/35">No description</p>
            )}

            <div className="border-t border-white/8 pt-6">
              <p className="text-xs text-white/28">{project.id}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}