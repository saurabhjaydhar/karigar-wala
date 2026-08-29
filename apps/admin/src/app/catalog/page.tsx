"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Tag, MapPin, Layers, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Label } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  fetchAreas,
  createArea,
  deleteArea,
  fetchAdminServices,
  createAdminService,
  deleteAdminService,
  type AdminCategory,
} from "@/lib/api/catalog";
import { ApiError } from "@/lib/api-client";

function CategoriesSection() {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createCategory({ name, slug, startingPrice: Number(startingPrice) || 0 });
      setName("");
      setSlug("");
      setStartingPrice("");
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create category");
    }
  }

  async function handleDelete(id: string) {
    await deleteCategory(id);
    await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  return (
    <Card>
      <h2 className="flex items-center gap-2 font-semibold text-foreground">
        <Tag className="size-4 text-brand-navy-600 dark:text-brand-navy-300" />
        Service Categories
      </h2>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm">
        {categories?.map((c) => (
          <li
            key={c._id}
            className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2 dark:border-white/10"
          >
            <span className="text-foreground">
              {c.name} <span className="text-slate-500">(/{c.slug})</span> — from ₹{c.startingPrice}
            </span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(c._id)}>
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-2">
        <Label>
          Name
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Label>
        <Label>
          Slug
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. plumber" />
        </Label>
        <Label>
          Starting price (₹)
          <Input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            className="w-28"
          />
        </Label>
        <Button type="submit" size="sm">
          <Plus className="size-3.5" />
          Add category
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Card>
  );
}

function AreasSection() {
  const queryClient = useQueryClient();
  const { data: areas } = useQuery({ queryKey: ["admin-areas"], queryFn: fetchAreas });
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createArea({ name, city });
      setName("");
      setCity("");
      await queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create area");
    }
  }

  async function handleDelete(id: string) {
    await deleteArea(id);
    await queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
  }

  return (
    <Card>
      <h2 className="flex items-center gap-2 font-semibold text-foreground">
        <MapPin className="size-4 text-brand-navy-600 dark:text-brand-navy-300" />
        Serviceable Areas
      </h2>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm">
        {areas?.map((a) => (
          <li
            key={a._id}
            className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2 dark:border-white/10"
          >
            <span className="text-foreground">
              {a.name} <span className="text-slate-500">({a.city})</span>
            </span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(a._id)}>
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-2">
        <Label>
          Area name
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Label>
        <Label>
          City
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </Label>
        <Button type="submit" size="sm">
          <Plus className="size-3.5" />
          Add area
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Card>
  );
}

function SubServicesSection({ categories }: { categories: AdminCategory[] | undefined }) {
  const queryClient = useQueryClient();
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: fetchAdminServices });
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categoryName = (id: string) => categories?.find((c) => c._id === id)?.name ?? "—";

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createAdminService({ categoryId, name, basePrice: Number(basePrice) || 0 });
      setName("");
      setBasePrice("");
      await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create sub-service");
    }
  }

  async function handleDelete(id: string) {
    await deleteAdminService(id);
    await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
  }

  return (
    <Card>
      <h2 className="flex items-center gap-2 font-semibold text-foreground">
        <Layers className="size-4 text-brand-navy-600 dark:text-brand-navy-300" />
        Sub-Services
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Optional line items customers can pick when booking a category (e.g. &quot;Fan
        Installation&quot; under Electrician).
      </p>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm">
        {services?.map((s) => (
          <li
            key={s._id}
            className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2 dark:border-white/10"
          >
            <span className="text-foreground">
              <span className="text-slate-500">[{categoryName(s.categoryId)}]</span> {s.name} — from ₹{s.basePrice}
            </span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(s._id)}>
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-2">
        <Label>
          Category
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select…</option>
            {categories?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          Name
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Label>
        <Label>
          Base price (₹)
          <Input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="w-28"
          />
        </Label>
        <Button type="submit" size="sm" disabled={!categoryId || !name.trim()}>
          <Plus className="size-3.5" />
          Add sub-service
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Card>
  );
}

export default function AdminCatalogPage() {
  const { data: categories } = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });

  return (
    <div>
      <PageHeader
        title="Services & Categories"
        subtitle="Manage service categories, sub-services, and the areas you serve."
      />
      <div className="mt-6 flex flex-col gap-6">
        <CategoriesSection />
        <AreasSection />
        <SubServicesSection categories={categories} />
      </div>
    </div>
  );
}
