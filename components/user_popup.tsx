'use client'
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useState, useRef, useEffect } from "react";
import { checkSubscription } from "@/lib/subscription";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

export const UserPopup = ({ imageId }: { imageId: string }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isPro, setIsPro] = useState(false); // Add state to track if the user is a Pro user

  const popoverRef = useRef<HTMLDivElement | null>(null); // Add type annotation

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "images", `${imageId}`);
      const docSnap = await getDoc(docRef);

      try {
        setLoading(true);
        if (docSnap.exists()) {
            const userId = docSnap.data().userId;
            const isProUser = await checkSubscription(userId);
            setIsPro(isProUser); // Set the isPro state

          const fullName = docSnap.data().firstName + " " + docSnap.data().lastName;
          setName(fullName);
          const email = docSnap.data().email_adress;
          setEmail(email);

          const imagesCollection = collection(db, "images");
          const q = query(imagesCollection, where("email_adress", "==", email));
          const querySnapshot = await getDocs(q);
          setPosts(querySnapshot.size);

          let likesCount = 0;
          querySnapshot.forEach((imageDoc) => {
            const likes = imageDoc.data().likes;
            likesCount += likes.filter((likeEmail: string) => likeEmail === email).length;
          });
          setTotalLikes(likesCount);
        } else {
          console.error("Document with imageId not found in Firestore.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imageId]);

  const handleHover = () => {
    // Show the popover when the name text is hovered
    if (popoverRef.current) {
      popoverRef.current.style.visibility = "visible";
      popoverRef.current.style.opacity = "1";
    }
  }

  const handleLeave = () => {
    // Hide the popover when the mouse leaves the name text
    if (popoverRef.current) {
      popoverRef.current.style.visibility = "hidden";
      popoverRef.current.style.opacity = "0";
    }
  }

  return (
    <>
      {/* Your existing name text */}
      <span onMouseEnter={handleHover} onMouseLeave={handleLeave} style={{ cursor: "pointer" }}>
        {name}{isPro && (
         <span className="bg-blue-100 text-blue-800 text-mm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2">PRO </span>
  )}
      
</span>
      <div
        ref={(ref) => (popoverRef.current = ref)} // Set the ref using a callback
        id="popover-user-profile"
        role="tooltip"
        className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        {/* Your popover content */}
        <div className="p-3">
          <div className="flex items-cen
          ter justify-between mb-2">
            <div>
            </div>
          </div>
          <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
            <a href="#">{name}</a>{isPro && (
              <span className="bg-blue-100 text-blue-800 text-mm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2">PRO </span>
    
  )}
          </p>
          <p className="mb-3 text-sm font-normal">
            <a href="#" className="hover:underline">{email}</a>
          </p>
          <ul className="flex text-sm">
            <li className="mr-2">
              <a href="#" className="hover:underline">
                <span className="font-semibold text-gray-900 dark:text-white">{posts}</span>
                <span>Posts</span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                <span className="font-semibold text-gray-900 dark:text-white">{totalLikes}</span>
                <span>Likes</span>
              </a>
            </li>
          </ul>
        </div>
        <div data-popper-arrow></div>
      </div>
    </>
  );
}
