'use client'
import { useState } from "react";
import { promptOptions } from "../app/(dashboard)/(routes)/dashboard/constants";



export const getRandomPromptIndex = () => {
  const randomIndex = Math.floor(Math.random() * promptOptions.length);
  return randomIndex;
};
export const openModal = (isModalOpen : boolean , setIsModalOpen : any) => {
  setIsModalOpen(true);
};
export const handleSurpriseMeClick = (setTextInput : any) => {
  const randomIndex = getRandomPromptIndex();

  if (randomIndex !== null) {
    setTextInput(promptOptions[randomIndex]);
  }
};
