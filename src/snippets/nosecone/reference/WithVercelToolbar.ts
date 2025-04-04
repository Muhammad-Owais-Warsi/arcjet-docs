import nosecone, { defaults, withVercelToolbar } from "nosecone";
import type { NoseconeOptions } from "nosecone";

const noseconeConfig: NoseconeOptions = {
  ...defaults,
  // Any customizations needed
};

const headers = nosecone(
  process.env.VERCEL_ENV === "preview"
    ? withVercelToolbar(noseconeConfig)
    : noseconeConfig,
);
