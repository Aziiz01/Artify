'use client'
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";

interface ImageData {
    id: string;
    imageUrl: string;
    prompt: string;
    // Add more fields as needed
}

const ExplorePage: React.FC = () => {
    const [images, setImages] = useState<ImageData[]>([]);

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

    const handleLike = async (imageId: string) => {
        try {
            // Check if the user has already liked the image
            const likedImagesRef = doc(db, "images", imageId);
            const docSnap = await getDoc(likedImagesRef);
            if (docSnap.exists()) {
                const currentLikes = docSnap.data().likes;
                await updateDoc(doc(db, "images", imageId), {
                    likes: currentLikes + 1,
                });
                console.log("liked")
            } else {
                console.log("error while liking!");
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
                        <button onClick={() => handleLike(image.id)}>Like</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExplorePage;
