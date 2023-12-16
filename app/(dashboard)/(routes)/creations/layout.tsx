const ExploreLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="h-full bg-gradient-to-br from-gray-300 to-blue-200 overflow-auto">
      
      <div className="mx-auto max-w-screen-xl h-full w-full">
        {children}
      </div>
    </main>
   );
}
 
export default ExploreLayout;