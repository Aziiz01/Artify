import { Settings } from "lucide-react";
import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { getCredits } from "@/lib/credits";

const SettingsPage = async () => {
  const isPro = await checkSubscription();
 const credits = await getCredits(); // Corrected function call

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
        Your credits are: {credits} 
      </div>
    </div>
  );
}

export default SettingsPage;
