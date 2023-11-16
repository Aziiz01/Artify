  "use client"
  import { LandingNavbar } from "@/components/landing-navbar";
  import { LandingHero } from "@/components/landing-hero";
  import { LandingContent } from "@/components/landing-content";
  import { Parallax, ParallaxLayer } from '@react-spring/parallax'
  import InstructionCard from '@/components/ui/instructionCard';
  import InstructionImage from "@/components/ui/instructionImage";
  import CardModel from "@/components/ui/cardModel";
  import CarouselComponent from "@/components/ui/carousel";
  import TyperWriter from "@/components/ui/typerWriter";

  import img2 from '@/public/img2.jpg'
  import img1 from '@/public/img1.jpg'
  import horizon from '@/public/horizon.jpg';
  import robot from '@/public/robot.jpg';
  import Discover from "@/components/ui/discoverTransition";


  const cardData = [
    {
      url: '/dashboard',
      imageSrc: robot.src,
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
      <div>
        <Parallax 
          pages={7}
          >
          <ParallaxLayer factor={1} style={{zIndex:'9999'}}>
            <LandingNavbar  />
          </ParallaxLayer>
          <ParallaxLayer 
          speed={1}
          factor={8}
          style={{backgroundImage:`url(${horizon.src})`, backgroundSize:'cover'}}
          >

          </ParallaxLayer>
          <ParallaxLayer sticky={{start:0.1,  end:0.3}}>
            <LandingHero/>
          </ParallaxLayer>
          <ParallaxLayer 
            offset={1}
            speed={0.5}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Black with 70% opacity */
              display:'grid',
              gridTemplateColumns:'50% 50%',
              gridTemplateRows:'50% 50%',
              zIndex:'1'

            }}
            >
              <InstructionCard title="  AI-Powered Image Generation"
                description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
              />
              <InstructionImage backgroundImage={robot.src} gridColumn="2 / 3" gridRow="1 / 3"/>
          </ParallaxLayer>
          <ParallaxLayer offset={2}
           style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Black with 70% opacity */
            display:'grid',
            gridTemplateColumns:'50% 50%',
            gridTemplateRows:'50% 50%',
            zIndex:'1'}}
            speed={0.5}
         >
              <InstructionImage backgroundImage={robot.src} gridColumn="1 / 2" gridRow="1 / 3"/>
              <InstructionCard title="  AI-Powered Image Generation"
                description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
              />
            
          </ParallaxLayer>
          <ParallaxLayer 
            offset={3}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Black with 70% opacity */
              display:'grid',
              gridTemplateColumns:'50% 50%',
              gridTemplateRows:'50% 50%',
              zIndex:'2'}}     
              speed={0.5}
          >
             <InstructionCard title="  AI-Powered Image Generation"
                description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
              />
              <InstructionImage backgroundImage={robot.src} gridColumn="2 / 3" gridRow="1 / 3"/>

          </ParallaxLayer>
          <ParallaxLayer
            offset={4}
            speed={1}
            factor={4}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 1)', /* Black with 70% opacity */
              display:'flex',
              flexDirection:'column',
              zIndex:'1'}}
          >
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
              <div className="w-full flex flex-col justify-center">
                    <div className=" flex w-full justify-center items-center">
                    <div style={{width:'90%'}}>
                      <CarouselComponent />
                    </div>
                  </div>
              </div>
          </ParallaxLayer>

          <ParallaxLayer offset={6}
              factor={1}
              speed={0.5}
              style={{
              backgroundColor: 'rgba(0, 0, 0, 1)', /* Black with 70% opacity */
              display:'flex',
              flexDirection:'column',
              zIndex:'1'}}>
            <Discover/>
          </ParallaxLayer>
        </Parallax>
      </div>
    );
  }
  
  export default LandingPage;
