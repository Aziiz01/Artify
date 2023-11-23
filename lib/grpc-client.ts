import * as Generation from "../app/generation/generation_pb";
import { GenerationServiceClient } from "../app/generation/generation_pb_service";
import { grpc as GRPCWeb } from "@improbable-eng/grpc-web";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import dotenv from "dotenv"; // Import dotenv

// Load environment variables from .env file
console.log("Before dotenv.config()");
dotenv.config();
console.log("After dotenv.config()");
// This is a NodeJS-specific requirement - browsers implementations should omit this line.
GRPCWeb.setDefaultTransport(NodeHttpTransport());

// Retrieve the 'API_KEY' from the environment
export const apiKey = "sk-6NoWpvUXGEKd2J5M1G0bDgLNZTzPPvwOfzdXhgHqQGBptoBX";

if (!apiKey) {
  throw new Error("API_KEY environment variable is not set.");
}

// Create a generation client to use with all future requests
export const metadata = new GRPCWeb.Metadata();
metadata.set("Authorization", `Bearer ${apiKey}`);

export const client = new GenerationServiceClient("https://grpc.stability.ai", {});
