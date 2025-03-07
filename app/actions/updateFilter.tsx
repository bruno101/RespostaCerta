"use server";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import ISelector from "../interfaces/ISelector";
import Filter from "../models/Filter";
import { authOptions } from "@/lib/auth";

export async function updateFilter(customOptions: ISelector[]) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (session?.user?.role != "admin") {
      return { success: false, message: "Unauthorized" };
    }
    // Create the update object using $addToSet to avoid duplicates
    const updateObject: any = {};
    updateObject.$addToSet = {};
    // For each field in customOptions, create an $addToSet operation
    customOptions.forEach((item) => {
      if (item.options && item.options.length > 0) {
        // Use $addToSet with $each to add multiple values without duplicates
        updateObject.$addToSet = {
          ...updateObject.$addToSet,
          [item.name]: { $each: item.options },
        };
      }
    });

    // If there's nothing to update, return early
    if (Object.keys(updateObject).length === 0) {
      return { success: false, message: "No valid fields to update" };
    }
    // Find the first document and update it
    // The { new: true } option returns the updated document
    const updatedFilter = await Filter.findOneAndUpdate(
      {}, // Empty filter to get the first document
      updateObject,
      { new: true }
    );
    if (updatedFilter) {
      return {
        success: true,
        message: "Success",
      };
    }
  } catch (error) {
    console.error("Error updating filter options:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
