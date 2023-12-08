import Link from "next/link";

export  const packs = [
    {
        title: "AI BEGINNER",
        description: "Ideal for those new to AI. Get started on your AI journey. Learn the basics of AI algorithms and tools.",
        monthlyPrice: 5.99,
        quarterlyPrice: 4.79, // 20% discount for quarterly
        additionalDetails: {
          monthlyCredits: "💰 100 Credits /month",
          firstMonthCredits: "🤑 150 credits in your first month",
          limitedTimeOffer: "Limited time offer",
          discountedPrice: "$6 $4.79 USD /month* SAVE 20%",
          billedEvery3Months: "$14.37 billed every 3 months",
          quarterlyCreditsDelivery: "Credits delivered quarterly in advance",
          upgradeInfo: "UPGRADE NOW\nCancel any time",
          creditPrice: "$0.048 /credit",
          imageLimit: "310 SDXL images/month^",
          freeFineTune: "1 free fine-tune/month",
          accessModels: "Access PRO-only models",
          communityModels: "Use community fine-tuned models",
          noAds: "No ads",
          creditRollOver: "Credits roll-over & never expire",
          advancedSearch: "Advanced public search",
          privateSearch: "Search your own private creations",
          proBadge: "PRO badge on your profile",
          tipCreators: "Tip other creators",
          earnTopups: "Earn topups and badges as normal",
          pauseCancelInfo: "Pause, delay or cancel any time",
        },
      },
      
      {
        title: "AI HOBBYIST",
        description: "Perfect for AI enthusiasts who want to explore more. Access advanced AI projects and workshops.",
        monthlyPrice: 9.99,
        quarterlyPrice: 7.99, // 20% discount for quarterly
        additionalDetails: {
          monthlyCredits: "💰 200 Credits /month",
          firstMonthCredits: "🤑 300 credits in your first month",
          limitedTimeOffer: "Limited time offer",
          discountedPrice: "$10 $7.99 USD /month* SAVE 20%",
          billedEvery3Months: "$23.97 billed every 3 months",
          quarterlyCreditsDelivery: "Credits delivered quarterly in advance",
          upgradeInfo: "UPGRADE NOW\nCancel any time",
          creditPrice: "$0.04 /credit",
          imageLimit: "410 SDXL images/month^",
          freeFineTune: "1 free fine-tune/month",
          accessModels: "Access PRO-only models",
          communityModels: "Use community fine-tuned models",
          noAds: "No ads",
          creditRollOver: "Credits roll-over & never expire",
          advancedSearch: "Advanced public search",
          privateSearch: "Search your own private creations",
          proBadge: "PRO badge on your profile",
          tipCreators: "Tip other creators",
          earnTopups: "Earn topups and badges as normal",
          pauseCancelInfo: "Pause, delay or cancel any time",
        },
      },
      
      {
        title: "AI ENTHUSIAST",
        description: "For AI enthusiasts who want advanced features and content. Dive deep into AI research and development.",
        monthlyPrice: 9.99,
        quarterlyPrice: 15.99, // 20% discount for quarterly
        additionalDetails: {
          monthlyCredits: "💰 500 Credits /month",
          firstMonthCredits: "🤑 750 credits in your first month",
          limitedTimeOffer: "Limited time offer",
          discountedPrice: "$20 $15.99 USD /month* SAVE 20%",
          billedEvery3Months: "$47.97 billed every 3 months",
          quarterlyCreditsDelivery: "Credits delivered quarterly in advance",
          upgradeInfo: "UPGRADE NOW\nCancel any time",
          creditPrice: "$0.032 /credit",
          imageLimit: "710 SDXL images/month^",
          freeFineTune: "2 free fine-tunes/month",
          accessModels: "Access PRO-only models",
          communityModels: "Use community fine-tuned models",
          noAds: "No ads",
          creditRollOver: "Credits roll-over & never expire",
          advancedSearch: "Advanced public search",
          privateSearch: "Search your own private creations",
          proBadge: "PRO badge on your profile",
          tipCreators: "Tip other creators",
          earnTopups: "Earn topups and badges as normal",
          pauseCancelInfo: "Pause, delay or cancel any time",
        },
      },
      
      {
        title: "AI ARTIST",
        description: "Unlock the full potential of AI for creative projects. Create AI-generated art and music with advanced tools.",
        monthlyPrice: 49.99,
        quarterlyPrice: 39.99, // 20% discount for quarterly
        additionalDetails: {
          monthlyCredits: "💰 1400 Credits /month",
          firstMonthCredits: "🤑 2100 credits in your first month",
          limitedTimeOffer: "Limited time offer",
          discountedPrice: "$50 $39.99 USD /month* SAVE 20%",
          billedEvery3Months: "$119.97 billed every 3 months",
          quarterlyCreditsDelivery: "Credits delivered quarterly in advance",
          upgradeInfo: "UPGRADE NOW\nCancel any time",
          creditPrice: "$0.03 /credit",
          imageLimit: "1,610 SDXL images/month^",
          freeFineTune: "3 free fine-tunes/month",
          accessModels: "Access PRO-only models",
          communityModels: "Use community fine-tuned models",
          noAds: "No ads",
          creditRollOver: "Credits roll-over & never expire",
          advancedSearch: "Advanced public search",
          privateSearch: "Search your own private creations",
          proBadge: "PRO badge on your profile",
          tipCreators: "Tip other creators",
          earnTopups: "Earn topups and badges as normal",
          pauseCancelInfo: "Pause, delay or cancel any time",
        },
      },
      
];

export const FAQSection = () => {
  const faqs = [
    {
      question: "Can I cancel my subscription?",
        answer:   <>
        You can cancel your subscription at any time and you ll still keep your PRO benefits. You can also pause your payment. All this can be done from the Manage my subscription section under{' '}
        <Link href="/settings">
          <div className="text-blue-500 hover:underline">Settings .</div>
        </Link>
        
      </>
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we prioritize the security of your data. We use advanced security features and comply with PCI DSS standards. We also don't keep your payment data.",
      },
    {
      question: "Do credits expire?",
      answer: "No. Any unused credits will roll over into the next month. Even if you cancel your PRO membership, you'll still have access to all the credits you received while you were subscribed.",
    },
    {
      question : "Can I get a refund?",
      answer : "If you stop using Imaginfy but forget to cancel your Imaginify PRO subscription, we'll generally be happy to refund your latest subscription payment as long as you haven't used any credits or created any images since the payment went through. To request a refund, send us a refund request via the email Mohamedaziz.nacib@esprit.tn ."
    },
    {
      question: "How many artworks can I create per day for free?",
      answer : "You can create unlimited base Stable Diffusion creations for free. Other algorithms and more powerful settings are also available but cost credits to generate."
    },
    {
      question :"What if my creation fails / is marked as error?",
      answer :"We know not all creations are successful. If your creation fails, send a refund request to the Crisp chat in the bottom right corner and we'll get you refund with an apology bonus ."
    },
    {
      question : "Why does it cost money?",
      answer : "Imaginify used to offer unlimited creations for free, but the model quickly proved unsustainable as we grew. It takes a lot of computing power to process a creation, and that costs us money. However, as algorithms become more optimised, and compute power becomes cheaper, the cost of Imaginify credits has and will continue to go down."
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pricing FAQs</h2>
      <div className="grid gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
            <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};