import React from 'react';
import '../css/link.css'

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, children }) => {
  return (
    <a className='a' href={href}>
      <span className='span'></span>
      <span className='span'></span>
      <span className='span'></span>
      <span className='span'></span>
      {children}
    </a>
  );
};

export default LinkButton;