import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs';
import React from 'react';

const UserCredits = ({ credits }: { credits: number | string }) => {

   return (
    <div className="fixed right-0 p-4 bg-gray-200 rounded-l-lg shadow-md z-10">
      <div className="flex items-center">
        <span className="mr-2 text-sm font-medium text-gray-700">Credits:</span>
        <span className="text-lg font-bold text-blue-700">{credits}</span>
      </div>
    </div>
  );
};

export default UserCredits;
