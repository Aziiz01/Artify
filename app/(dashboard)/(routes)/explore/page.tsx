'use client'
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import LikesList from "./LikesList"; // Import the LikesList component

interface ImageData {
    id: string;
    imageUrl: string;
    prompt: string;
    likes: string[]; // Update the type to an array of user emails
    // Add more fields as needed
}

const ExplorePage: React.FC = () => {
    const [showLikesList, setShowLikesList] = useState(false);
    const [images, setImages] = useState<ImageData[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

    const user = useUser();

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
                const q = query(imagesRef, where("published", "==", true));
                const querySnapshot = await getDocs(q);

                const imageData: ImageData[] = [];
                querySnapshot.forEach((doc) => {
                    imageData.push({
                        id: doc.id,
                        imageUrl: doc.data().image, // Assuming image is stored as a URL
                        prompt: doc.data().prompt,
                        likes: doc.data().likes, // Update to get the list of user emails who liked the image
                        // Add more fields here
                    });
                });

                setImages(imageData);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    const isLiked = (image: ImageData, user_email: string) => {
        return image.likes.includes(user_email);
    };

    const handleLike = async (imageId: string) => {
        try {
            const user_email = user.user?.emailAddresses[0].emailAddress ?? ""; // Use empty string as a default value
            const likedImage = images.find((image) => image.id === imageId);
            if (likedImage) {
                if (isLiked(likedImage, user_email)) {
                    // Implement "Unlike" logic here
                    const updatedLikes = likedImage.likes.filter(email => email !== user_email);
                    await updateDoc(doc(db, "images", imageId), {
                        likes: updatedLikes,
                    });

                    // Update local state to reflect the change
                    setImages((prevImages) => prevImages.map((prevImage) =>
                        prevImage.id === imageId ? {
                            ...prevImage,
                            likes: updatedLikes,
                        } : prevImage
                    ));
                } else {
                    // Update Firestore to add the user's email to the "likes" array
                    const updatedLikes = [...likedImage.likes, user_email];
                    await updateDoc(doc(db, "images", imageId), {
                        likes: updatedLikes,
                    });

                    // Update local state to reflect the change
                    setImages((prevImages) => prevImages.map((prevImage) =>
                        prevImage.id === imageId ? {
                            ...prevImage,
                            likes: updatedLikes,
                        } : prevImage
                    ));
                }
            }
        } catch (error) {
            console.error("Error handling like:", error);
        }
    };

    return (
         <div>
      <h1>Explore Images</h1>
      <div className="image-list">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <Image src={image.imageUrl} alt={image.prompt} height={512} width={512} />
            <p>{image.prompt}</p>
            <button onClick={() => handleLike(image.id)}>
              {isLiked(image, user.user?.emailAddresses[0].emailAddress) ? "Unlike" : "Like"}
            </button>
            <span>{image.likes.length} Likes</span>
            <button onClick={() => openLikesList(image)}>See Likes</button>
          </div>
        ))}
      </div>

      {showLikesList && selectedImage && (
        <LikesList image={selectedImage} onClose={closeLikesList} />
      )}
    </div>
    );
};

export default ExplorePage;
