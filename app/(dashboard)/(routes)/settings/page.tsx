import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { getCredits } from "@/lib/credits";
import { auth } from "@clerk/nextjs";
import { getPackage } from "@/lib/package";
import { Footer } from "@/components/footer";
import { Payment_Button } from "@/components/payment_button";
import './css.css';
import Link from "next/link";

const SettingsPage = async () => {
  const { userId }: { userId: string | null } = auth();
  const isPro = await checkSubscription(userId);
  const credits = await getCredits();
  const p = await getPackage();

  return (
    <>
      <div className="space-y-4 text-center mb-10">
        <h2 className="font-abc text-6xl mt-5 text-blue-900 font-extrabold">
          Settings Page
        </h2>
        <p className="text-gray-500 text-lg">
          Explore your settings page to conveniently view credits, manage packages, and oversee your subscriptions effortlessly
        </p>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>User Plan</td>
            <td>{isPro ? "Pro Plan" : "Free Plan"}</td>
          </tr>
          <tr>
            <td>Credits</td>
            <td>{credits}</td>
          </tr>
          <tr>
            <td>Current Package</td>
            <td>{p ? `Current package: ${p}` : "No package selected"}</td>
          </tr>
          <tr>
            <td>Action</td>
            <td>
            <div  className="w-1/2 ml-36">

              <SubscriptionButton isPro={isPro} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

     
<Link href="/credits">
      <Payment_Button />
      </Link>
      <Footer />
    </>
  );
}

export default SettingsPage;
