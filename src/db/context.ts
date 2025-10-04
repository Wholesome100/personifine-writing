import "server-only";

import { neon } from "@neondatabase/serverless";
import process from "node:process";

// Database context we import when interacting with the db
export const sql = neon(process.env.DATABASE_URL!);
