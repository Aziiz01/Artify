import { Settings } from "lucide-react";
import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { getCredits } from "@/lib/credits";
import { auth } from "@clerk/nextjs";
import { getPackage } from "@/lib/package";
import { Footer } from "@/components/footer";

const SettingsPage = async () => {
  const { userId } : { userId: string | null } = auth();
  const isPro = await checkSubscription(userId);
 const credits =await  getCredits(); 
const p = await getPackage();
  return ( 
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
        <div className="mb-1">     
           Your credits are: {credits} 
</div>
        {p ?(
          `Your current package is ${p}`
        ): ""}
      </div>
      <Footer />
    </div>
  );
}

export default SettingsPage;
