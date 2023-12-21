import UserCredits from "@/components/credit_button";
import Navbar from "@/components/navbar";
import { getCredits } from "@/lib/credits";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
const credits = await getCredits();
  return ( 
    <div className="bg-gradient-to-br from-gray-300 to-blue-200" >
 <div className="bg-gray-900 ">
            <Navbar />
            </div>  
                <main className="bg-gradient-to-br from-gray-300 to-blue-200"  >
                  <UserCredits credits={credits} />
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;
