import { Request, Response } from "express";
import { z } from "zod";
import { ReferralWithId } from "../../types/referrals";

// Database mock
let referrals: ReferralWithId[] = [];
let id = 0; // Mimic a database auto-increment ID field

// Zod Schema for validation
const referralSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  prefix: z.string().min(1, "Prefix is required"),
  phone: z
    .number()
    .refine((val) => val.toString().length >= 10 && val.toString().length <= 11, {
      message: "Phone must be 10-11 digits long",
    }),

});

// Create Referral with Validation**
export const create = (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsedData = referralSchema.parse(req.body);

    // Check if email already exists
    const emailExists = referrals.some((referral) => referral.email === parsedData.email);
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    // Create referral object
    const newReferral = {
      id: ++id,
      ...req.body,
    };
    
    // Push directly to the array
    referrals.push(newReferral);
    
    // Send response
    return res.status(201).json(newReferral);
  } catch (error) {
    return res.status(400).json({ error: error instanceof z.ZodError ? error.format() : "Invalid request" });
  }
};

// **Get All Referrals**
export const fetch = (_: Request, res: Response) => {
  return res.status(200).json(referrals);
};

// **Update specific referral
export const update = (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsedData = referralSchema.parse(req.body);

    // Extract the ID from the request as a Number
    const id = Number(req.params.id);

    // Validate if the ID is valid
    if (isNaN(id)) return res.status(400).json({ error: "Invalid referral ID" });

    // Find the referral to update
    const referralIndex = referrals.findIndex((referral) => referral.id === id);
    if (referralIndex === -1) {
      return res.status(404).json({ error: "Referral not found" });
    }

    // Check if email already exists
    const emailExists = referrals.some((referral) => referral.email === parsedData.email && referral.id !== id);
    if (emailExists) {
      return res.status(400).json({ error: "Unable to update, email already exists!" });
    }

    // Preserve existing avatar unless a new file is uploaded
    const existingReferral = referrals[referralIndex];

    // Update the referral using spread operator
    referrals[referralIndex] = { ...referrals[referralIndex], ...req.body };

    // Send response
    return res.status(201).json(null);
  } catch (error) {
    return res.status(400).json({ error: error instanceof z.ZodError ? error.format() : "Invalid request" });
  }
}

// **Delete specific referral
export const destroy = (req: Request, res: Response) => {
  try {
    // Extract the ID from the request as a Number
    const id = Number(req.params.id);

    // Validate if the ID is valid
    if (isNaN(id)) return res.status(400).json({ error: "Invalid referral ID" });

    // Find the referral index
    const referralIndex = referrals.findIndex((referral) => referral.id === id);
    if (referralIndex === -1) {
      return res.status(404).json({ error: "Referral not found" });
    }

    // Remove the referral from the array
    referrals.splice(referralIndex, 1);

    // Send a success response
    return res.status(200).json({ message: "Referral deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};