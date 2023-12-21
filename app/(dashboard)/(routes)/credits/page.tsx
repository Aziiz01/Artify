'use client'
import axios from "axios"
import { useState, useEffect } from "react"
import PricingCard from "../../../../components/packCard";
import { useRouter } from "next/navigation";
import './style.css'
import { Info } from "@/app/(dashboard)/(routes)/credits/credit_info";
import { Footer } from "@/components/footer";
import { S_Loader } from "@/components/s_loader";
import { Payment_Button } from "@/components/payment_button";
import { Mastercard } from "@/components/ui/mastercard";
const Pricing = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const router = useRouter();
  const [selectedInterval, setSelectedInterval] = useState<string>('monthly');
  const [loading, setLoading] = useState(true);  // New state for loading

  const fetchPrices = async () => {
    try {
      const { data } = await axios.get('/api/packs');
      setPrices(data);
      setLoading(false);  // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching prices:", error);
      setLoading(false);  // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    fetchPrices();
    router.refresh();
  }, [router]);


  const handleSubscription = async (e: React.MouseEvent<HTMLButtonElement>, price: any) => {
    e.preventDefault();
    console.log("Sending POST request to /api/stripe with priceId:", price.id);
   
    try {
      const { data } = await axios.post('/api/stripe',
        {
          priceId: price.id
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Received response from /api/stripe:", data);
      window.location.assign(data);
    } catch (error) {
      console.error("Error while sending POST request:", error);
    }
  };
  
  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
  };

  const filteredPrices = prices.filter((price) => {
    if (selectedInterval === 'monthly') {
      return price.recurring.interval === 'month' && price.recurring.interval_count === 1;
    } else if (selectedInterval === 'quarterly') {
      return price.recurring.interval === 'month' && price.recurring.interval_count === 3;
    }
  });

  return (
    <>
   <section className="w-full h-full">
         <div className="mx-auto max-w-4xl text-center items-center mt-10">
         <h2 className="font-abc text-6xl mt-5 text-blue-900 font-extrabold">
Upgrade To Imaginify Pro   
     </h2>     
       <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center">Go PRO for a monthly credit pack, early access to new models, no ads, and a range of other perks.</p>
         </div>
           {loading ? (
            <div className="flex flex-col items-center mt-8 mb-8">
            <S_Loader />
          </div>
      ) : (
        <>
         <div className="flex justify-center mt-6 space-x-4 mb-2">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="monthly"
            checked={selectedInterval === 'monthly'}
            onChange={() => handleIntervalChange('monthly')}
          />
          <span className="ml-2 font-bold text-gray-700 dark:text-gray-300">Monthly</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="quarterly"
            checked={selectedInterval === 'quarterly'}
            onChange={() => handleIntervalChange('quarterly')}
          />
          <span className="ml-2 font-bold text-gray-700 dark:text-gray-300">Quarterly       
       <span className="bg-green-400 text-white text-mm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2">SAVE 50% </span>
        </span>
        </label>
      </div>
         <div className="grid grid-cols-3 sm:grid-cols-3 gap-8 max-w-[1040px] items-center mx-auto mt-10">
         {filteredPrices.map((price) => (
         <>
        <div>
<div key={price.id} className="container">
  <p className="title">{price.lookup_key}</p>
  <p className="price">$ {(price.unit_amount)/100}<span>/month</span></p>
	<p className="description">
						{ (price.metadata.credits !== 'unlimited') ?
						<span className="text-l text-gray-500 dark:text-gray-400 font-semibold">~{(price.unit_amount / 100 / (parseInt(price.metadata.credits))).toFixed(3)}$ per credit</span>
						: null}</p> 
  <ul className="lists">
						<li className="list font-bold">
							
							<span>{price.metadata.credits} credits</span>
						</li>
						<li className="list">
							
							<span>Enhance Access</span>
						</li>
						<li className="list">
							
							<span>Upscale Access</span>
						</li>
						<li className="list">
							
							<span>PRO badge on your profile</span>
						</li>
						<li className="list">
							
							{ (price.metadata.credits === 'unlimited')?
							<span >Credits roll-over & never expire until deadline</span>
							: <span>Credits roll-over & never expire</span>
							}
							</li>
							<li className="list">
								
								<span>24×7 phone & email support</span>
							</li>

					</ul>
          { (price.metadata.credits == 'unlimited') ?
          <b className="offer">Act fast! Offer ends on February 15, 2024.</b> : null }
  <button className="subscribe-button"  onClick={(e) => handleSubscription(e, price)}>Upgrade</button>
  { (price.metadata.credits == 'unlimited') ?
  <div className="ribbon-wrap">
    <div className="ribbon">Special Offer!
    </div>
  </div> : null }
</div>
</div>
</>
))}

         </div>
        
      <Info />
    </>
      )}
   </section>
   <Footer />

   </>
  )
}

export default Pricing