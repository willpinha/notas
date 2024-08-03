import { defineCollection, reference, z } from "astro:content";

const notasCollection = defineCollection({
	type: "content",
	schema: z.object({
		tags: z.array(z.enum(["github", "react"])),
		titulo: z.string(),
		relacionadas: z.array(reference("notas")),
		referencias: z.array(z.string().url()),
	}),
});

export const collections = {
	notas: notasCollection,
};
