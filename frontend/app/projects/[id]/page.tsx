import Link from "next/link";
import { getProjectById } from "@/lib/api";
import ProjectBoard from "@/components/board/project-board";

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
            className="mb-6 inline-flex items-center text-sm text-white/50 transition hover:text-white/80"
          >
            ← Back
          </Link>

          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
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
          className="mb-6 inline-flex items-center text-sm text-white/50 transition hover:text-white/80"
        >
          ← Back
        </Link>

        <ProjectBoard initialProject={project} />
      </section>
    </main>
  );
}