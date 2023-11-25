import Navbar from "@/components/navbar";
const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  
//<ParticlesBackground />
  return ( 
    <div >
 <div className="bg-gray-900 ">
            <Navbar />
            </div>  
                <main className="bg-gradient-to-br from-gray-300 to-orange-200"  >
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;
