"use client";

import React, { useState, useEffect } from "react";
import { ApplicationForm } from "@/components/apply/application-form";

interface Vacancy {
  id: string;
  title: string;
  code: string;
  department: string;
  location: string;
  workType: string;
  employmentType: string;
  salary?: string;
  description: string;
  requirements: string;
}

const DEFAULT_VACANCIES: Vacancy[] = [
  {
    id: "v-1",
    title: "Graduate Software Engineer 2026",
    code: "GRAD-2026-SE",
    department: "Software Development",
    location: "Johannesburg / Hybrid",
    workType: "Hybrid",
    employmentType: "Full-time",
    salary: "R350,000 - R450,000",
    description: "Join DVT's flagship annual graduate intake. You will work alongside senior software architects building cloud-native microservices, modern frontend web apps (React, Next.js), and backend APIs (C#, .NET 10).",
    requirements: "BSc or BCom Computer Science, Information Technology, or Software Engineering degree. Minimum 65% academic average. Exposure to C#, Python, or JavaScript.",
  },
  {
    id: "v-2",
    title: "Junior Cloud & DevOps Specialist",
    code: "GRAD-2026-CLOUD",
    department: "Cloud Infrastructure",
    location: "Cape Town / Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salary: "R380,000 - R480,000",
    description: "Specialized graduate track focused on AWS & Azure cloud architecture, infrastructure-as-code (Terraform), Docker container orchestration, and CI/CD automation pipelines.",
    requirements: "Degree in IT / Computer Science. Strong interest in Linux systems, Cloud infrastructure, Docker, and CI/CD pipelines.",
  },
  {
    id: "v-3",
    title: "Graduate Data Engineer & AI Specialist",
    code: "GRAD-2026-AI",
    department: "Data & Artificial Intelligence",
    location: "Durban / Hybrid",
    workType: "Hybrid",
    employmentType: "Full-time",
    salary: "R360,000 - R460,000",
    description: "Work with DVT AI labs building LLM pipelines, RAG applications, SQL/NoSQL data warehouses, and machine learning models for enterprise clients across South Africa and the UK.",
    requirements: "Degree in Data Science, Computer Science, or Applied Mathematics. Proficiency in Python, SQL, Pandas, and basic LLM fundamentals.",
  },
];

export function CareersClient() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(DEFAULT_VACANCIES);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  useEffect(() => {
    fetchBackendVacancies();
  }, []);

  const fetchBackendVacancies = async () => {
    try {
      // Backend URL configured in Next environment
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/vacancies`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVacancies(data);
        }
      }
    } catch {
      // fallback to DEFAULT_VACANCIES
    }
  };

  const filteredVacancies = vacancies.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.department.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "All" || v.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ["All", ...Array.from(new Set(vacancies.map((v) => v.department)))];

  return (
    <div>
      {!selectedVacancy ? (
        <div className="space-y-8">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <input
              type="text"
              placeholder="Search by job title, keyword, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 bg-slate-900/80 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-dvt-blue"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 font-medium">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-slate-900/80 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-dvt-blue"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vacancy Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl transition-all hover:border-dvt-blue/60 hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-semibold text-dvt-blue bg-dvt-blue/10 px-2 py-0.5 rounded border border-dvt-blue/20">
                      {vacancy.code}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {vacancy.workType}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-dvt-blue transition-colors">
                    {vacancy.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{vacancy.department} • {vacancy.location}</p>

                  <p className="mt-4 text-xs text-gray-300 line-clamp-3 leading-relaxed">
                    {vacancy.description}
                  </p>

                  {vacancy.salary && (
                    <div className="mt-4 text-xs text-emerald-400 font-medium">
                      Estimated Package: {vacancy.salary}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSelectedVacancy(vacancy)}
                    className="w-full rounded-md py-2.5 text-xs font-bold text-white bg-dvt-blue hover:bg-dvt-blue/80 transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    View Details & Apply <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredVacancies.length === 0 && (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400">No vacancies match your search parameters.</p>
              <button
                onClick={() => { setSearch(""); setDepartmentFilter("All"); }}
                className="mt-3 text-xs text-dvt-blue underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Vacancy Application View */
        <div className="max-w-4xl mx-auto space-y-8">
          <button
            onClick={() => setSelectedVacancy(null)}
            className="text-xs font-semibold text-dvt-blue hover:underline inline-flex items-center gap-1.5"
          >
            ← Back to All Careers
          </button>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Role Details */}
            <div className="lg:col-span-7 space-y-6 bg-slate-900/70 border border-white/10 p-6 rounded-xl backdrop-blur-md">
              <div>
                <span className="font-mono text-xs font-semibold text-dvt-blue bg-dvt-blue/10 px-2 py-0.5 rounded border border-dvt-blue/20">
                  {selectedVacancy.code}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{selectedVacancy.title}</h2>
                <p className="text-xs text-gray-400">{selectedVacancy.department} • {selectedVacancy.location} • {selectedVacancy.employmentType}</p>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-4 text-xs text-gray-300 leading-relaxed">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">About the Intakes & Program</h4>
                  <p>{selectedVacancy.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Eligibility & Technical Requirements</h4>
                  <p>{selectedVacancy.requirements}</p>
                </div>

                {selectedVacancy.salary && (
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Compensation Package</h4>
                    <p className="text-emerald-400 font-semibold">{selectedVacancy.salary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Application Form with vacancyId */}
            <div className="lg:col-span-5">
              <ApplicationForm vacancyId={selectedVacancy.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
