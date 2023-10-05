"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("979c7dbe-28fa-4077-9f88-5e7bbe3097ec");
  }, []);

  return null;
};
