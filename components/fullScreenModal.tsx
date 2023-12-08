import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';


interface FullScreenModalProps {
  onClose: () => void;
  content: React.ReactNode; // Add this prop

}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ onClose, content }) => {
  return (
    <div className="fixed inset-0 flex flex-col gap-100 bg-black bg-opacity-50 z-50">
        <div className="flex justify-end mt-0">
          <Button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </Button> 
        </div>
        <div className='flex items-center justify-center mt-100'>
          {content}
        </div>
    </div>
  )
}
export default FullScreenModal;