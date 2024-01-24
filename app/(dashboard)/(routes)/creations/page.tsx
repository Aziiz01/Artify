'use client'
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc, orderBy, startAfter, limit } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import LikesList from "./LikesList";
import { useLoginModal } from "@/hook/use-login-modal";
import Modal from 'react-modal';
import "../../../static/creation_explore.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faHeart } from "@fortawesome/free-solid-svg-icons";
import { UserPopup } from "@/components/user_popup";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { S_Loader } from "@/components/s_loader";
import { checkSubscription } from "@/lib/subscription";
import { useProModal } from "@/hook/use-pro-modal";

interface ImageData {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt:string;
  likes: string[];
  height: number;
  width: number;
  style : string,
  model : string,
  published: boolean;
  timeStamp: Date;

}
const filteringOptions = [
  { label: "Created Date (Descending)", value: "createdDateDesc" },
  { label: "Created Date (Ascending)", value: "createdDateAsc" },
  { label: "Most Liked", value: "mostLiked" },
];
const CreationsPage: React.FC = () => {
  const [showLikesList, setShowLikesList] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const loginModal = useLoginModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState<string>("createdDateDesc");
  const [loading, setLoading] = useState(true);  
  const proModal = useProModal();

  let n;

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

  const isPaid = async () => {
    if (isSignedIn) {
      const userId = user.id;
      const isPro = await checkSubscription(userId);
      console.log('isPro:', isPro); // Add this line for debugging

      return isPro;
    } 
  };
  useEffect(() => {
    const setIsMountedAndOpenModal = async () => {
      const isPro = await isPaid();
      console.log('isPro in useEffect:', isPro); // Add this line for debugging

      if (!isPro) {
        proModal.onOpen();
      }
    };
  
    setIsMountedAndOpenModal();
  }, []);

  useEffect(() => {

    const fetchImages = async () => {
      if (!isSignedIn) {
        loginModal.onOpen();
      } else {
        try {
          const userId = user.id;
          const imagesRef = collection(db, "images");
          let q: any;
  
          switch (filterOption) {
            case "createdDateDesc":
              q = query(imagesRef, where("userId", "==", userId), orderBy("timeStamp", "desc"));
              break;
            case "createdDateAsc":
              q = query(imagesRef, where("userId", "==", userId), orderBy("timeStamp", "asc"));
              break;
              case "mostLiked":
                q = query(
                  imagesRef,
                  where("userId", "==", userId),
                  orderBy("likes", "desc"),
                );
                break;
              
              
            default:
              q = query(imagesRef, where("userId", "==", userId), orderBy("timeStamp", "asc"));
          }
  
          const querySnapshot = await getDocs(q);
          if (querySnapshot==null) {
            return null;
          } else {   const imageData: ImageData[] = [];
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
                imageUrl: data.image,
                prompt: data.prompt,
                negativePrompt : data.negativePrompt,
                likes: data.likes,
                height: data.height,
                width: data.width,
                style: data.Style,
                model: data.Model,
                published: data.published,
                timeStamp: createdAtDate,
              });
            });
    
            setImages(imageData);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };
    if (isLoaded && isSignedIn) {
      fetchImages();
      if (fetchImages == null){
       const n=null;
      }
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user, loginModal, filterOption,n]);
  
  
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
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for darkness
      zIndex: 1000,
    },
    content: {
      maxWidth: '800px',
      margin: 'auto',
    },
  };
  
  return (
    <div>
      {n? (
        <div className="text-center mt-8">
          <h1 className="text-3xl font-semibold mb-4">You dont have any creations</h1>
          <p className="text-lg text-gray-500 mb-4">Start generating art and more</p>
          <div>
      
      <Link href="/dashboard">
        <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
          Start Generating For Free
        </Button>
      </Link>
    </div>       
   </div>
      ) : (
       
        <>
         <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3em' }}>My Creations</h1>
      </div>
    
         {loading ? (
            <div className="flex flex-col items-center mt-8 mb-8 ">
            <S_Loader />
          </div>
      ) : (
        <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1em' }}>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((image) => (
             <div key={image.id} className="grid gap-3 relative">
             <div className="card" onClick={() => openModal(image)}>
             <Image
                           className="image h-auto max-w-full rounded-lg"
                           src={image.imageUrl}
                           alt={image.prompt}
                           height={image.height}
                           width={image.width}
             
                         />
               <div className="card__content">
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

               <UserPopup imageId={image.id} />
               <button className="Btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from propagating
                  if (!isSignedIn) {
                    loginModal.onOpen();
                  } else if (!isLiked(image, user.emailAddresses[0].emailAddress)) {
                    handleLike(image.id); // Handle the like action
                  }
                }}>
  <span className="leftContainer">
  <FontAwesomeIcon icon={faHeart} />
    <span className="like"> {!isSignedIn ? 'login-required' :isLiked(image, user.emailAddresses[0].emailAddress) ? 'liked' : 'Like'}</span>
  </span>
  <span className="likeCount">
  {image.likes.length} likes
  </span>
</button>
           </div>
           <hr style={{ height: '1px', background: '#ccc', border: 'none', margin: '10px 0' }} />
           <button className="publish"
           onClick={(e) => {
            e.stopPropagation();
            togglePublish(image.id, image.published);
          }}> {image.published ? (
            <>Unpublish <FontAwesomeIcon icon={faEyeSlash} title="Unpublished" /></>
          ) : (
            <>Publish<FontAwesomeIcon icon={faEye} title="Published" /></>
          )}
</button>
                         
                           <div>
                     <div style={{ marginBottom: '10px' }}>
                       <h2 style={{ fontSize: '1em', fontWeight: 'bold' }}>Prompt :</h2>
                       {image.prompt}
                     </div>
                     {((image.negativePrompt) && (image.negativePrompt !== '') )?
                     <div style={{ marginBottom: '10px' }}>
                       <h2 style={{ fontSize: '1.2em', fontWeight: 'bold' }}>negativePrompt : </h2>
                       {image.negativePrompt}
                     </div>
             : null}
                     <hr style={{ height: '1px', background: '#ccc', border: 'none', margin: '10px 0' }} />
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <div style={{ marginBottom: '10px' }} >
                         {image.model}
                       </div>
                       <div style={{ marginBottom: '10px' }} >
                         {image.style}
                       </div>
                       <div>
                         {image.height} x {image.width}
                       </div>
                     </div>
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
                     
        <div className="absolute inset-0 flex items-center justify-center">
                <S_Loader />
              </div>

          <div className="modal-image-container">

            <Image
              src={selectedImage.imageUrl}
              alt="selectedImage"
              fill
              className="image"

            />
            
          </div> 
        </div>
      )}
    </Modal>
    </>
)}
        </>
      )}
    </div>
  );
  
            }
export default CreationsPage;
