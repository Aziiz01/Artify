import React, { ButtonHTMLAttributes } from 'react';
import '../css/nav_button.css';

interface SpecialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText: string;
}

export const Special_button = ({ buttonText, ...rest }: SpecialButtonProps) => {
  return (
    <button className='special w-full' {...rest}>
      {buttonText}
    </button>
  );
};
