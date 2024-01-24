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
    <div className="bg-white" >
 <div className="bg-gray-900 ">
            <Navbar />
            </div>  
                <main  >
                  <UserCredits credits={credits} />
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;
