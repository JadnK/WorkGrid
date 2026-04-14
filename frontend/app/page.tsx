"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject
} from "@/lib/api";
import { Project } from "@/types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
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
      const project = await createProject(newTitle);
      setProjects((currentProjects) => [...currentProjects, project]);
      setNewTitle("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Could not create project.");
    }
  }

  function startEditing(project: Project) {
    setEditingProjectId(project.id);
    setEditingTitle(project.title);
  }

  function cancelEditing() {
    setEditingProjectId(null);
    setEditingTitle("");
  }

  async function handleUpdateProject(projectId: string) {
    if (!editingTitle.trim()) {
      return;
    }

    try {
      const updatedProject = await updateProject(projectId, editingTitle);

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId ? updatedProject : project
        )
      );

      setEditingProjectId(null);
      setEditingTitle("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Could not update project.");
    }
  }

  async function handleDeleteProject(projectId: string) {
    try {
      await deleteProject(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId)
      );

      if (editingProjectId === projectId) {
        cancelEditing();
      }

      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Could not delete project.");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-neutral-400">
            Workgrid
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Projects
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300">
            Create, rename and delete your projects from one simple dashboard.
          </p>
        </div>

        <form
          onSubmit={handleCreateProject}
          className="mb-8 flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:flex-row"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Enter project title"
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Create project
          </button>
        </form>

        {errorMessage ? (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-neutral-400">
            No projects yet. Create your first one.
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => {
              const isEditing = editingProjectId === project.id;

              return (
                <article
                  key={project.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
                >
                  {isEditing ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none"
                      />

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateProject(project.id)}
                          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-white">
                          {project.title}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-400">
                          Project ID: {project.id}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEditing(project)}
                          className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="rounded-xl border border-red-900 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-950/40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}