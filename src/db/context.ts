import { neon } from "@neondatabase/serverless";

// Database context we import when interacting with the db
export const sql = neon(process.env.DATABASE_URL!);
