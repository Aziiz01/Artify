'use client'
import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Special_button } from "./ui/special_button";

export const SubscriptionButton = ({ isPro}: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/portal`);


      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Special_button
  disabled={loading}
  onClick={onClick}
  buttonText={isPro ? "Manage Subscription" : "Upgrade"}
>
</Special_button>

  );
};