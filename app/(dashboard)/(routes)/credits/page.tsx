'use client'
import axios from "axios"
import { useState, useEffect } from "react"
import PricingCard from "../../../../components/packCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Info } from "@/app/(dashboard)/(routes)/credits/credit_info";
import { Footer } from "@/components/footer";
import { S_Loader } from "@/components/s_loader";
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
         <div className="mx-auto max-w-4xl text-center items-center">
              <p className=" text-4xl font-bold text-gray-900 sm:text-5xl">Upgrade to Imaginify PRO</p>
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
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-[1040px] items-center mx-auto">
         {filteredPrices.map((price) => (
         <>

<div key={price.id} className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
<h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{price.lookup_key}</h5>
<div className="flex items-baseline text-gray-900 dark:text-white mb-1">
<span className="text-3xl font-semibold">$</span>
<span className="text-5xl font-extrabold tracking-tight">{(price.unit_amount)/100}</span>
<span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
</div>
{ (price.metadata.credits !== 'unlimited') ?
<span className="ml-4 text-l text-gray-500 dark:text-gray-400 font-semibold">~{(price.unit_amount / 100 / (parseInt(price.metadata.credits))).toFixed(3)}$ per credit</span>
: null}
<ul role="list" className="space-y-5 mt-3">
<li className="flex items-center">
<svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>
<span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{price.metadata.credits} credits</span>
</li>
<li className="flex">
<svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>
<span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Enhance Access</span>
</li>
<li className="flex">
<svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>
<span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Upscale Access</span>
</li>
<li className="flex">
<svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>
<span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">No Ads</span>
</li>
<li className="flex">
<svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>
<span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">PRO badge on your profile</span>
</li>
<li className="flex">
<svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>
{ (price.metadata.credits === 'unlimited')?
<span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Credits roll-over & never expire until deadline</span>
: <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Credits roll-over & never expire</span>
}
</li>
<li className="flex">
<svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>
<span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3 mb-3">24×7 phone & email support</span>
</li>
</ul>
<button type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
  onClick={(e) => handleSubscription(e, price)}
  >Choose plan</button>
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