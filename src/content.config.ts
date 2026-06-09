import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectStatus = z.enum(['active', 'completed', 'archived', 'experimental']);
const noteStatus = z.enum(['seedling', 'growing', 'evergreen']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    status: projectStatus,
    featured: z.boolean().default(false),
    technologies: z.array(z.string()),
    role: z.string(),
    repository: z.string().url().optional(),
    demo: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    topic: z.string(),
    tags: z.array(z.string()).default([]),
    status: noteStatus,
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog, notes };
