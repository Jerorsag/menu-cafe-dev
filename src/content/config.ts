import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()),
  })
});

export const collections = {
  'blog': blogCollection,
};