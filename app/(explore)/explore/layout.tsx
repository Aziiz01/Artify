import { LandingNavbar } from "@/components/landing-navbar";

const ExploreLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="h-full bg-[#ffffff] overflow-auto">
      <div className="bg-gray-900 ">
            <LandingNavbar />
            </div>
      <div className="mx-auto max-w-screen-xl h-full w-full">
        {children}
      </div>
    </main>
   );
}
 
export default ExploreLayout;