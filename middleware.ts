import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/" , "/api/webhook","/api/packs","/sign-up", "/sign-in"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
