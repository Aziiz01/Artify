import Image from "next/image";
import '../css/loader.css'

interface EmptyProps {
  label: string;
}

export const Empty = ({
  label
}: EmptyProps) => {
  return (
    <div>
  <div className="grid grid-cols-2 gap-10">
  <div className="toold-card">
  <Image className ="imgd" src="/toold.svg" height={20} width={10}  alt="toolImage"/>
  <div className="text">
    <p className="h3"> Enahance your images </p>
    <p className="p">PRO ONLY </p>

</div></div>
   
  <div className="toold-card p-4">
Enhance Images  </div>
  <div className="toold-card p-4">
Upscaling  </div>
  <div className="toold-card p-4">
    Animate Images
  </div>
</div>

 
      </div>
  );
};
