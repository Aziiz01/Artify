import React from "react";

interface LikesListProps {
  image: ImageData;
  onClose: () => void;
}

const LikesList: React.FC<LikesListProps> = ({ image, onClose }) => {
  return (
    <div className="likes-list-modal">
      <h2>Likes</h2>
      <ul>
        {image.likes.map((userEmail : any, index : any) => (
          <li key={index}>{userEmail}</li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default LikesList;
