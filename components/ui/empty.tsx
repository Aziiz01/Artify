import Image from "next/image";
import '../css/loader.css'

interface EmptyProps {
  label: string;
}

export const Empty = ({
  label
}: EmptyProps) => {
  return (
    <>
   <div className="pyramid-loader">
  <div className="wrapper">
    <span className="side side1"></span>
    <span className="side side2"></span>
    <span className="side side3"></span>
    <span className="side side4"></span>
    <span className="shadow"></span>
  </div>  
  <p className="text-muted-foreground text-lg text-center">
        {label}
      </p>
</div>

 
      </>
  );
};
