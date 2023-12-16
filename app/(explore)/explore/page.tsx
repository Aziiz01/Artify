'use client'
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import LikesList from "./LikesList";
import { useLoginModal } from "@/hook/use-login-modal";
import Modal from 'react-modal';
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { UserPopup } from "@/components/user_popup";

interface ImageData {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  likes: string[];
  height: number;
  width: number;
  style : string,
  model : string,
  timeStamp: Date;

}
const filteringOptions = [
  { label: "Created Date (Descending)", value: "createdDateDesc" },
  { label: "Created Date (Ascending)", value: "createdDateAsc" },
  { label: "Most Liked", value: "mostLiked" },
];
const ExplorePage: React.FC = () => {
  const [showLikesList, setShowLikesList] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const loginModal = useLoginModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState<string>("createdDateDesc");

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
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = collection(db, "images");
        let q: any;

        switch (filterOption) {
          case "createdDateDesc":
            q = query(imagesRef,where("published", "==", true), orderBy("timeStamp", "desc"));
            break;
          case "createdDateAsc":
            q = query(imagesRef, where("published", "==", true), orderBy("timeStamp", "asc"));
            break;
            case "mostLiked":
              q = query(
                imagesRef,
                where("published", "==", true),
                orderBy("likes", "desc"),
              );
              break;
            
            
          default:
            q = query(imagesRef, where("published", "==", true), orderBy("timeStamp", "asc"));
        }
        const querySnapshot = await getDocs(q);

        const imageData: ImageData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as {
            image: string;
            prompt: string;
            negativePrompt: string;
            likes: string[];
            height: number;
            width: number;
            Style: string;
            Model: string;
            published: boolean;
            timeStamp: Date;
          };
          const createdAtDate = new Date(data.timeStamp);
          imageData.push({
            id: doc.id,
            imageUrl:data.image,
            prompt:data.prompt,
            negativePrompt:data.negativePrompt,
            likes:data.likes,
            height:data.height,
            width:data.width,
            style :data.Style,
            model :data.Model,
            timeStamp: createdAtDate,

          });
        });

        setImages(imageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [filterOption]);

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
 <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3em' }}>Explore</h1>
      </div>    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1em' }}>
        <label htmlFor="filterDropdown" style={{ marginRight: '0.5em' }}>Filter By:</label>
        <select
          id="filterDropdown"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          {filteringOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
  ariaHideApp={false}
>
  {selectedImage && (
    <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
      <div style={{ marginRight: '20px' }}>
        <Image
          src={selectedImage.imageUrl}
          alt={selectedImage.prompt}
          height={512}
          width={512}
          className="image"
        />
      </div>
      <div>
        <div style={{ marginBottom: '10px' }}>
          <h2 style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{selectedImage.prompt}</h2>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <h2 style={{ fontSize: '1.2em', fontWeight: 'bold' }}>negativePrompt : {selectedImage.negativePrompt}</h2>
        </div>
        <hr style={{ height: '1px', background: '#ccc', border: 'none', margin: '10px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button style={{ marginBottom: '10px' }} className="button pink-button artistic-button">
            {selectedImage.model}
          </button>
          <button style={{ marginBottom: '10px' }} className="button purple-button artistic-button">
            {selectedImage.style}
          </button>
          <button className="button teal-button artistic-button">
            {selectedImage.height} x {selectedImage.width}
          </button>
        </div>
      </div>
    </div>
  )}
</Modal>

  </div>
);

};

export default ExplorePage;
