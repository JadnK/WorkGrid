"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject
} from "@/lib/api";
import Link from "next/link";
import { Project } from "@/types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch {
        setErrorMessage("Could not load projects.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTitle.trim()) {
      return;
    }

    try {
      const project = await createProject(newTitle, newDescription);
      setProjects((currentProjects) => [project, ...currentProjects]);
      setNewTitle("");
      setNewDescription("");
      setIsCreateOpen(false);
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not create project.");
    }
  }

  function startEditing(project: Project) {
    setEditingProjectId(project.id);
    setEditingTitle(project.title);
    setEditingDescription(project.description || "");
  }

  function cancelEditing() {
    setEditingProjectId(null);
    setEditingTitle("");
    setEditingDescription("");
  }

  async function handleUpdateProject(projectId: string) {
    if (!editingTitle.trim()) {
      return;
    }

    try {
      const updatedProject = await updateProject(
        projectId,
        editingTitle,
        editingDescription
      );

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId ? updatedProject : project
        )
      );

      cancelEditing();
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not update project.");
    }
  }

  async function handleDeleteProject(projectId: string) {
    const confirmed = window.confirm("Delete this project?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId)
      );

      if (editingProjectId === projectId) {
        cancelEditing();
      }

      setErrorMessage("");
    } catch {
      setErrorMessage("Could not delete project.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0c0f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <header className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/35">
              Workgrid
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Projects
            </h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/55">
            {projects.length} total
          </div>
        </header>

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[28px] border border-white/8 bg-white/[0.025] px-6 py-8 text-sm text-white/45">
            Loading...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-white/70">
              +
            </div>
            <h2 className="text-lg font-medium text-white">No projects</h2>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const isEditing = editingProjectId === project.id;

              return (
                <article
                  key={project.id}
                  className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/[0.045]"
                >
                  {isEditing ? (
                    <div className="flex h-full flex-col gap-4">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        placeholder="Title"
                        className="w-full rounded-2xl border border-white/10 bg-[#0d1116] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20"
                      />

                      <textarea
                        value={editingDescription}
                        onChange={(event) =>
                          setEditingDescription(event.target.value)
                        }
                        placeholder="Description"
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#0d1116] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20"
                      />

                      <div className="mt-auto flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateProject(project.id)}
                          className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.06]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col">
                      <Link
                        href={`/projects/${project.id}`}
                        className="mb-6 block rounded-2xl outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-white/20"
                      >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] text-sm font-medium text-white/70">
                          WG
                        </div>

                        <h2 className="text-lg font-medium tracking-tight text-white">
                          {project.title}
                        </h2>

                        {project.description ? (
                          <p className="mt-2 text-sm leading-6 text-white/42">
                            {project.description}
                          </p>
                        ) : null}
                      </Link>

                      <div className="mt-auto border-t border-white/8 pt-4">
                        <div className="mb-4 text-xs text-white/28">{project.id}</div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(project)}
                            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.06]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
                            className="rounded-xl border border-red-500/15 bg-red-500/5 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#11151b] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <form onSubmit={handleCreateProject}>
              <div className="mb-5">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  New project
                </h2>
              </div>

              <input
                type="text"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Title"
                autoFocus
                className="mb-3 w-full rounded-2xl border border-white/10 bg-[#0b0e12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20"
              />

              <textarea
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
                placeholder="Description"
                rows={4}
                className="mb-5 w-full resize-none rounded-2xl border border-white/10 bg-[#0b0e12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setNewTitle("");
                    setNewDescription("");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.06]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition hover:translate-y-[-1px] hover:opacity-95"
      >
        <span className="text-base leading-none">+</span>
        New project
      </button>
    </main>
  );
}