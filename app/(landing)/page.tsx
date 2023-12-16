import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import InstructionCard from '@/components/ui/instructionCard';
import InstructionImage from "@/components/ui/instructionImage";
import robot from '@/public/robot.jpg';
import front from '@/public/front.jpg'
import Example from "@/components/HorizontalScrollCarousel";
import homeBg from '@/public/homeBg.jpg';


const cardData = [
  {
    url: '/dashboard',
    imageSrc: front.src,
    title: 'Card 1',
    description: 'Description for Card 1',
  },
  {
    url: '/image-to-image',
    imageSrc: robot.src,
    title: 'Card 2',
    description: 'Description for Card 2',
  },
  {
    url: '/upscale',
    imageSrc: robot.src,
    title: 'Card 3',
    description: 'Description for Card 3',
  },
];

const LandingPage = () => {
  
  return ( 
    <div className="flex flex-col">
      <div style={{ backgroundImage: `url(${homeBg.src})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <LandingNavbar  />
      </div>
      <div style={{ backgroundImage: `url(${homeBg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <LandingHero/>
      </div>
      <div>
          <Example/>
      </div>
      <div style={{
          paddingLeft:'15px',
          paddingRight:'15px',
          display:'grid',
          gridTemplateColumns:'50% 50%',
          gridTemplateRows:'50% 50%',
        }}
          >
       <InstructionCard title="  AI-Powered Image Generation"
         description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
       />
       <InstructionImage backgroundImage={front.src} />
       <InstructionImage backgroundImage={robot.src} />
       <InstructionCard title="  AI-Powered Image Generation"
         description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
       />
    
      <InstructionCard title="  AI-Powered Image Generation"
         description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
       />
       <InstructionImage backgroundImage={robot.src} />
      </div>
        {/* <div>
          <div className="flex justify-center mt-6 ">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-pink-600 text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold ">New here? Let’s get started.</h1>
          </div>
            <div className="flex justify-center mt-6 ">
             <h6 className="text-2xl text-gray-100 font-extrabold " >Choose the best model for you and start creating awsome arts.</h6>
            </div>
            <div className="flex justify-center mt-6 ">
              <button type="button" className="w-5sm  text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:transform hover:scale-110 transition-transform">Create Account</button>
            </div>
            <div className="flex flex-row justify-evenly p-10 ">
                {cardData.map((card, index) => (
                  <CardModel key={index} 
                    url={card.url}
                    imageSrc={card.imageSrc}
                    title={card.title}
                    description={card.description}
                  />
                ))}
            </div>
            <div className="flex justify-center item-center">
              <TyperWriter/>
            </div>  

        </div> */}

       
        
    </div>
  );
}

export default LandingPage;
