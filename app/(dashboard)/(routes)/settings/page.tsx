import { Settings } from "lucide-react";
import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { getCredits } from "@/lib/credits";
import { auth } from "@clerk/nextjs";
import { getPackage } from "@/lib/package";
import { Footer } from "@/components/footer";
import { Payment_Button } from "@/components/payment_button";

const SettingsPage = async () => {
  const { userId } : { userId: string | null } = auth();
  const isPro = await checkSubscription(userId);
 const credits =await  getCredits(); 
const p = await getPackage();
  return ( 
    <div>
    <div className=" space-y-4 text-center mb-10">
    <h2 className="font-abc text-6xl mt-5 text-blue-900 font-extrabold">
Settings Page
        </h2>
        <p className="text-gray-500 text-lg">
        Explore your settings page to conveniently view credits, manage packages, and oversee your subscriptions effortlessly
                       </p>
      </div>
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
      <Payment_Button />

      <Footer />
    </div>
  );
}

export default SettingsPage;
