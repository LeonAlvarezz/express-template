import { Logger } from "@/lib";
import expressLoader from "./express";
import type { Express } from "express";

export default async ({ expressApp }: { expressApp: Express }) => {
  try {
    console.log("Starting loader process...");

    // Ensure DB connection is established
    Logger.info("✌️ DB loaded and connected!");

    // Dependency Injection logging
    Logger.info("✌️ Dependency Injector loaded");

    // Apply express loader
    await expressLoader({ app: expressApp });

    // Log after express loader
    Logger.info("✌️ Express loaded");
  } catch (error) {
    console.error("Error in loader process:", error);
    throw error;
  }
};
