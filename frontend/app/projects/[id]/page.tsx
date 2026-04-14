import Link from "next/link";
import { getProjectById } from "@/lib/api";
import ProjectBoardClient from "@/components/board/project-board-client";

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
        <section className="px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center text-sm text-white/50 transition hover:text-white/80"
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
      <section className="px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/"
          className="mb-5 inline-flex items-center text-sm text-white/50 transition hover:text-white/80"
        >
          ← Back
        </Link>

        <ProjectBoardClient initialProject={project} />
      </section>
    </main>
  );
}