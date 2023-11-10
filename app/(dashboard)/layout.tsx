import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";
import { getApiLimitCount } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { userId } : { userId: string | null } = auth();
  const apiLimitCount = await getApiLimitCount(userId);
  const isPro = await checkSubscription(userId);

  return ( 
    <div >
      <Navbar />
      <main className="bg-gradient-to-br from-gray-300 to-orange-200"  >
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;
