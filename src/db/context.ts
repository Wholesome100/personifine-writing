"use server"; // Ensure the neon script is executed only on the server

import "server-only"; // Prevent the sql context from being imported into client code

import { neon } from "@neondatabase/serverless";
import process from "node:process";

// Database context we import when interacting with the db
export const sql = neon(process.env.DATABASE_URL!);
