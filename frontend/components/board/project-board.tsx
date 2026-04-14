"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
  createCategory,
  createItem,
  deleteCategory,
  moveItem
} from "@/lib/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project, ProjectCategory, ProjectItem, TaskPriority } from "@/types";

type ProjectBoardProps = {
  initialProject: Project;
};

function priorityBadge(priority: TaskPriority) {
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Medium";
}

export default function ProjectBoard({ initialProject }: ProjectBoardProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const [errorMessage, setErrorMessage] = useState("");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categorySubtitle, setCategorySubtitle] = useState("");
  const [categoryColor, setCategoryColor] = useState("#64748b");

  const [openItemCategoryId, setOpenItemCategoryId] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPriority, setItemPriority] = useState<TaskPriority>("medium");

  const sensors = useSensors(useSensor(PointerSensor));

  const itemLookup = useMemo(() => {
    const map = new Map<string, { categoryId: string; index: number }>();

    project.categories.forEach((category) => {
      category.items.forEach((item, index) => {
        map.set(item.id, {
          categoryId: category.id,
          index
        });
      });
    });

    return map;
  }, [project.categories]);

  async function handleCreateCategory() {
    if (!categoryName.trim()) {
      return;
    }

    try {
      const newCategory = await createCategory(project.id, {
        name: categoryName,
        subtitle: categorySubtitle,
        color: categoryColor
      });

      setProject((currentProject) => ({
        ...currentProject,
        categories: [...currentProject.categories, newCategory]
      }));

      setCategoryName("");
      setCategorySubtitle("");
      setCategoryColor("#64748b");
      setIsCategoryOpen(false);
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not create category.");
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    const confirmed = window.confirm("Delete this category?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(project.id, categoryId);

      setProject((currentProject) => ({
        ...currentProject,
        categories: currentProject.categories.filter(
          (category) => category.id !== categoryId
        )
      }));

      setErrorMessage("");
    } catch {
      setErrorMessage("Could not delete category.");
    }
  }

  async function handleCreateItem(categoryId: string) {
    if (!itemTitle.trim()) {
      return;
    }

    try {
      const newItem = await createItem(project.id, categoryId, {
        title: itemTitle,
        description: itemDescription,
        priority: itemPriority
      });

      setProject((currentProject) => ({
        ...currentProject,
        categories: currentProject.categories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: [...category.items, newItem]
              }
            : category
        )
      }));

      setItemTitle("");
      setItemDescription("");
      setItemPriority("medium");
      setOpenItemCategoryId(null);
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not create item.");
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeItemId = String(active.id);
    const activeMeta = itemLookup.get(activeItemId);

    if (!activeMeta) {
      return;
    }

    const overId = String(over.id);

    let targetCategoryId = overId;
    let targetIndex = 0;

    const overMeta = itemLookup.get(overId);

    if (overMeta) {
      targetCategoryId = overMeta.categoryId;
      targetIndex = overMeta.index;
    } else {
      const targetCategory = project.categories.find(
        (category) => category.id === overId
      );

      if (!targetCategory) {
        return;
      }

      targetCategoryId = targetCategory.id;
      targetIndex = targetCategory.items.length;
    }

    if (
      activeMeta.categoryId === targetCategoryId &&
      activeMeta.index === targetIndex
    ) {
      return;
    }

    try {
      const updatedProject = await moveItem(project.id, activeItemId, {
        sourceCategoryId: activeMeta.categoryId,
        targetCategoryId,
        targetIndex
      });

      setProject(updatedProject);
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not move item.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.title}
          </h1>
          {project.description ? (
            <p className="mt-2 text-sm text-white/45">{project.description}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsCategoryOpen(true)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.07]"
        >
          New category
        </button>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {project.categories.map((category) => (
            <CategoryColumn
              key={category.id}
              category={category}
              onDelete={() => handleDeleteCategory(category.id)}
              isCreateItemOpen={openItemCategoryId === category.id}
              onOpenCreateItem={() => setOpenItemCategoryId(category.id)}
              onCloseCreateItem={() => {
                setOpenItemCategoryId(null);
                setItemTitle("");
                setItemDescription("");
                setItemPriority("medium");
              }}
              itemTitle={itemTitle}
              setItemTitle={setItemTitle}
              itemDescription={itemDescription}
              setItemDescription={setItemDescription}
              itemPriority={itemPriority}
              setItemPriority={setItemPriority}
              onCreateItem={() => handleCreateItem(category.id)}
            />
          ))}
        </div>
      </DndContext>

      {isCategoryOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#11151b] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">New category</h2>
            </div>

            <div className="space-y-3">
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Name"
                className="w-full rounded-2xl border border-white/10 bg-[#0b0e12] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
              />

              <input
                value={categorySubtitle}
                onChange={(event) => setCategorySubtitle(event.target.value)}
                placeholder="Subtitle"
                className="w-full rounded-2xl border border-white/10 bg-[#0b0e12] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
              />

              <input
                type="color"
                value={categoryColor}
                onChange={(event) => setCategoryColor(event.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b0e12] px-2"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-black"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type CategoryColumnProps = {
  category: ProjectCategory;
  onDelete: () => void;
  isCreateItemOpen: boolean;
  onOpenCreateItem: () => void;
  onCloseCreateItem: () => void;
  itemTitle: string;
  setItemTitle: (value: string) => void;
  itemDescription: string;
  setItemDescription: (value: string) => void;
  itemPriority: TaskPriority;
  setItemPriority: (value: TaskPriority) => void;
  onCreateItem: () => void;
};

function CategoryColumn({
  category,
  onDelete,
  isCreateItemOpen,
  onOpenCreateItem,
  onCloseCreateItem,
  itemTitle,
  setItemTitle,
  itemDescription,
  setItemDescription,
  itemPriority,
  setItemPriority,
  onCreateItem
}: CategoryColumnProps) {
  return (
    <div
      id={category.id}
      className="min-h-[420px] w-[320px] shrink-0 rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="block h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h2 className="text-base font-medium text-white">{category.name}</h2>
          </div>
          {category.subtitle ? (
            <p className="text-xs text-white/40">{category.subtitle}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-white/35 transition hover:text-red-200"
        >
          Delete
        </button>
      </div>

      <SortableContext
        items={category.items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {category.items.map((item) => (
            <TaskCard key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>

      {isCreateItemOpen ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="space-y-3">
            <input
              value={itemTitle}
              onChange={(event) => setItemTitle(event.target.value)}
              placeholder="Task title"
              className="w-full rounded-xl border border-white/10 bg-[#0d1116] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20"
            />

            <textarea
              value={itemDescription}
              onChange={(event) => setItemDescription(event.target.value)}
              placeholder="Description"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#0d1116] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20"
            />

            <select
              value={itemPriority}
              onChange={(event) =>
                setItemPriority(event.target.value as TaskPriority)
              }
              className="w-full rounded-xl border border-white/10 bg-[#0d1116] px-3 py-2.5 text-sm text-white outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCreateItem}
                className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black"
              >
                Add
              </button>
              <button
                type="button"
                onClick={onCloseCreateItem}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/75"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenCreateItem}
          className="mt-4 w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.04]"
        >
          + Add task
        </button>
      )}
    </div>
  );
}

function TaskCard({ item }: { item: ProjectItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-[18px] border border-white/8 bg-[#11151a] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-white">{item.title}</h3>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/55">
          {priorityBadge(item.priority)}
        </span>
      </div>

      {item.description ? (
        <p className="text-xs leading-5 text-white/45">{item.description}</p>
      ) : null}
    </div>
  );
}