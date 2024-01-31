import { z } from "zod";
import { LocalFileSystemOutputLocationSchema } from "./LocalFileSystemOutputLocationSchema";
import { MavenOutputLocationSchema } from "./MavenOutputLocationSchema";
import { NpmOutputLocationSchema } from "./NpmOutputLocationSchema";
import { NugetOutputLocationSchema } from "./NugetOutputLocationSchema";
import { PostmanOutputLocationSchema } from "./PostmanOutputLocationSchema";
import { PypiOutputLocationSchema } from "./PypiOutputLocationSchema";

export const GeneratorOutputSchema = z.discriminatedUnion("location", [
    NpmOutputLocationSchema,
    MavenOutputLocationSchema,
    PypiOutputLocationSchema,
    PostmanOutputLocationSchema,
    LocalFileSystemOutputLocationSchema,
    NugetOutputLocationSchema
]);

export type GeneratorOutputSchema = z.infer<typeof GeneratorOutputSchema>;
