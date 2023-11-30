'use client'
import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { doc, updateDoc , getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
export const PublishButton =  ({ imageId}: { imageId: string }) => {
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [docId , setDocId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "images", imageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsPublished(docSnap.data().published);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching publish status:", error);
      }
    };
    fetchData(); 

  }, [imageId]);
  const onClick = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "images", imageId);
      await updateDoc(docRef, {
        published: !isPublished,
      });
  
      // Update the state with the new value
      setIsPublished(!isPublished);

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Button variant="secondary" onClick={onClick} disabled={loading}>
    {isPublished ? (
  <> <FontAwesomeIcon icon={faEyeSlash} title="Unpublished" className="h-4 w-4 mr-2"/>Unpublish</>
  ) : (
  <><FontAwesomeIcon icon={faEye} title="Published" className="h-4 w-4 mr-2" />Publish</>
      )}
  </Button>
  );
};