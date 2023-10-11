import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const getCredits = async () => {
    const { userId } = auth();
  
    if (!userId) {
      return 0; // User is not authenticated, return 0 credits.
    }
  
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId: userId,
      },
      select: {
        credits: true,
      },
    });
  
    if (!userSubscription) {
      return 0; // User doesn't have credits, return 0 credits.
    }
  
    const userCredits = userSubscription.credits;
  
    return userCredits || 0; // Return the user's credits or 0 if no credits are found.
  };
  