"use client";

import dynamic from "next/dynamic";
import { Project } from "@/types";

const ProjectBoard = dynamic(() => import("@/components/board/project-board"), {
  ssr: false
});

type ProjectBoardClientProps = {
  initialProject: Project;
};

export default function ProjectBoardClient({
  initialProject
}: ProjectBoardClientProps) {
  return <ProjectBoard initialProject={initialProject} />;
}