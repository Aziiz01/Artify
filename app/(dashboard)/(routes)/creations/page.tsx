////////TO DESIGN 
'use client'
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import LikesList from "./LikesList";
import { useLoginModal } from "@/hook/use-login-modal";
import Modal from 'react-modal';
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faHeart } from "@fortawesome/free-solid-svg-icons";
import { UserPopup } from "@/components/user_popup";

interface ImageData {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: string[];
  height: number;
  width: number;
  style : string,
  model : string,
  published: boolean;

}

const CreationsPage: React.FC = () => {
  const [showLikesList, setShowLikesList] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const loginModal = useLoginModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image: ImageData) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };
  
  
  const openLikesList = (image: ImageData) => {
    setSelectedImage(image);
    setShowLikesList(true);
  };

  const closeLikesList = () => {
    setSelectedImage(null);
    setShowLikesList(false);
  };
  const togglePublish = async (imageId: string, published: boolean) => {
    try {
      await updateDoc(doc(db, "images", imageId), {
        published: !published,
      });

      setImages((prevImages) =>
        prevImages.map((prevImage) =>
          prevImage.id === imageId
            ? {
                ...prevImage,
                published: !published,
              }
            : prevImage
        )
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };
  useEffect(() => {
    const fetchImages = async () => {
      if (!isSignedIn) {
        loginModal.onOpen();
      } else {
        try {
          const userId = user.id;
          const imagesRef = collection(db, "images");
          const q = query(imagesRef, where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
  
          const imageData: ImageData[] = [];
          querySnapshot.forEach((doc) => {
            imageData.push({
              id: doc.id,
              imageUrl: doc.data().image,
              prompt: doc.data().prompt,
              likes: doc.data().likes,
              height: doc.data().height,
              width: doc.data().width,
              style: doc.data().Style,
              model: doc.data().Model,
              published : doc.data().published
            });
          });
  
          setImages(imageData);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };
  
    if (isLoaded && isSignedIn) {
      // Add a condition to check if the component is loaded and the user is signed in
      fetchImages();
    }
  }, [isLoaded, isSignedIn, user, loginModal]);
  
  const isLiked = (image: ImageData, user_email: string) => {
    return image.likes.includes(user_email);
  };

  const handleLike = async (imageId: string) => {
    if (!isSignedIn) {
      loginModal.onOpen();
    } else {
      try {
        const user_email = user.emailAddresses[0].emailAddress;
        const likedImage = images.find((image) => image.id === imageId);
        if (likedImage) {
          if (isLiked(likedImage, user_email)) {
            const updatedLikes = likedImage.likes.filter((email) => email !== user_email);
            await updateDoc(doc(db, "images", imageId), {
              likes: updatedLikes,
            });

            setImages((prevImages) =>
              prevImages.map((prevImage) =>
                prevImage.id === imageId
                  ? {
                      ...prevImage,
                      likes: updatedLikes,
                    }
                  : prevImage
              )
            );
          } else {
            const updatedLikes = [...likedImage.likes, user_email];
            await updateDoc(doc(db, "images", imageId), {
              likes: updatedLikes,
            });

            setImages((prevImages) =>
              prevImages.map((prevImage) =>
                prevImage.id === imageId
                  ? {
                      ...prevImage,
                      likes: updatedLikes,
                    }
                  : prevImage
              )
            );
          }
        }
      } catch (error) {
        console.error("Error handling like:", error);
      }
    }
  };
 
  const modalStyle = {
    content: {
      display: 'grid',
      gridTemplateColumn:'50% 50%',
      // Adjust the height as needed
    },
  };
  
  return (
  <div>
    <h1>Explore Images</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="grid gap-4 relative">
          <div
            onClick={() => openModal(image)}
            className="image-container"
            style={{ cursor: 'pointer' }}
          >
            
            <Image
              className="image h-auto max-w-full rounded-lg"
              src={image.imageUrl}
              alt={image.prompt}
              height={image.height}
              width={image.width}

            />
            <div className="image-overlay" >
            
              <UserPopup imageId={image.id} />
              <div
                className={`like-icon ${!isSignedIn ? 'login-required' : isLiked(image, user.emailAddresses[0].emailAddress) ? 'liked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from propagating
                  if (!isSignedIn) {
                    loginModal.onOpen();
                  } else if (!isLiked(image, user.emailAddresses[0].emailAddress)) {
                    handleLike(image.id); // Handle the like action
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faHeart} className="mr-1" />
              </div>
              <div
  className="publish-icon"
  onClick={(e) => {
    e.stopPropagation();
    togglePublish(image.id, image.published);
  }}
  style={{ cursor: "pointer" }}
>
  {image.published ? (
    <>
      Unpublish <FontAwesomeIcon icon={faEyeSlash} title="Unpublished" />
    </>
  ) : (
    <>
      Publish<FontAwesomeIcon icon={faEye} title="Published" /> 
    </>
  )}
</div>

              <div className="like-count">
                {image.likes.length} likes
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {showLikesList && selectedImage && (
      <LikesList image={selectedImage} onClose={closeLikesList} />
    )}
   <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Image Modal"
  style={modalStyle}
>
  {selectedImage && (
    <div className="vertical-modal-container">
      <div className="modal-image-container">
        <Image
          src={selectedImage.imageUrl}
          alt={selectedImage.prompt}
          height={selectedImage.height}
          width={selectedImage.width}
          className="image"
        />
      </div>
      <div className="details-container">
        <div className="text-container">
          <h2 className="image-prompt artistic-text">{selectedImage.prompt}</h2>
        </div>
        <hr className="horizontal-line" />
        <div className="buttons-container">
          <button className="button pink-button artistic-button">
            {selectedImage.model}
          </button>
          <button className="button purple-button artistic-button">
            {selectedImage.style}
          </button>
          <button className="button teal-button artistic-button">
            {selectedImage.height}*{selectedImage.width}
          </button>
        </div>
      </div>
    </div>
  )}
</Modal>

  </div>
);

};

export default CreationsPage;
