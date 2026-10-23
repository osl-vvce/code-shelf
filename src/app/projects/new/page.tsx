
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Plus,
} from "lucide-react";

type Student = {
  name: string;
  username: string;
};

type ProjectResponse = {
  message?: string;
  project?: {
    title: string;
  };
  error?: string;
};

export default function NewProjectPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [link, setLink] = useState("");
  const [liveDemo, setLiveDemo] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStudents() {
      try {
        const response = await fetch("/api/projects", {
          cache: "no-store",
        });

        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Could not load student profiles.";

          throw new Error(message);
        }

        if (!Array.isArray(data)) {
          throw new Error("The student profiles response was invalid.");
        }

        if (!cancelled) {
          const loadedStudents = data as Student[];
          setStudents(loadedStudents);

          if (loadedStudents.length > 0) {
            setUsername(loadedStudents[0].username);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load student profiles."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingStudents(false);
        }
      }
    }

    void loadStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          title,
          description,
          techStack,
          link,
          liveDemo,
        }),
      });

      const data: ProjectResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Project submission failed.");
      }

      if (!data.project) {
        throw new Error("The server returned an invalid response.");
      }

      setSuccess(
        `Project "${data.project.title}" was added to @${username}'s profile.`
      );

      setTitle("");
      setDescription("");
      setTechStack("");
      setLink("");
      setLiveDemo("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Project submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-[#d0d7de] bg-white px-3 py-2.5 text-sm text-[#1f2328] outline-none transition focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/15";

  const labelClass = "block text-sm font-semibold text-[#24292f]";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#656d76] hover:text-[#0969da]"
      >
        <ArrowLeft size={16} />
        Back to people
      </Link>

      <section className="overflow-hidden rounded-xl border border-[#d0d7de] bg-white shadow-sm">
        <div className="border-b border-[#d0d7de] bg-[#f6f8fa] px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#24292f] text-white">
              <Plus size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#656d76]">
                Code-Shelf
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-[#1f2328]">
                Add a project
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#656d76]">
            Share something you have built with the VVCE student community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-5 py-6 md:px-8 md:py-8"
        >
          <div>
            <label htmlFor="student" className={labelClass}>
              Student profile <span className="text-red-600">*</span>
            </label>

            <select
              id="student"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={inputClass}
              disabled={loadingStudents || students.length === 0}
            >
              {loadingStudents && (
                <option value="">Loading student profiles...</option>
              )}

              {!loadingStudents && students.length === 0 && (
                <option value="">No student profiles available</option>
              )}

              {students.map((student) => (
                <option key={student.username} value={student.username}>
                  {student.name} (@{student.username})
                </option>
              ))}
            </select>

            <p className="mt-1.5 text-xs text-[#656d76]">
              This repository currently has no sign-in system, so choose the
              profile for this demo submission.
            </p>
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>
              Project title <span className="text-red-600">*</span>
            </label>

            <input
              id="title"
              required
              maxLength={100}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Campus Companion"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description <span className="text-red-600">*</span>
            </label>

            <textarea
              id="description"
              required
              maxLength={1000}
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does your project do, and what problem does it solve?"
              className={`${inputClass} resize-y`}
            />

            <p className="mt-1 text-right text-xs text-[#656d76]">
              {description.length}/1000
            </p>
          </div>

          <div>
            <label htmlFor="techStack" className={labelClass}>
              Technologies <span className="text-red-600">*</span>
            </label>

            <input
              id="techStack"
              required
              value={techStack}
              onChange={(event) => setTechStack(event.target.value)}
              placeholder="React, TypeScript, Tailwind CSS"
              className={inputClass}
            />

            <p className="mt-1.5 text-xs text-[#656d76]">
              Separate technologies with commas.
            </p>
          </div>

          <div>
            <label htmlFor="link" className={labelClass}>
              GitHub repository URL <span className="text-red-600">*</span>
            </label>

            <input
              id="link"
              type="url"
              required
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://github.com/username/project"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="liveDemo" className={labelClass}>
              Live demo URL{" "}
              <span className="font-normal text-[#656d76]">(optional)</span>
            </label>

            <input
              id="liveDemo"
              type="url"
              value={liveDemo}
              onChange={(event) => setLiveDemo(event.target.value)}
              placeholder="https://your-project.vercel.app"
              className={inputClass}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

              <div>
                {success}
                <p className="mt-1">
                  <Link
                    href={`/${username}`}
                    className="font-semibold underline"
                  >
                    View student profile
                  </Link>{" "}
                  (refresh the profile if already open).
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-[#d0d7de] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#656d76]">
              Fields marked * are required.
            </p>

            <button
              type="submit"
              disabled={
                submitting || loadingStudents || students.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2ea043] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add project
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}