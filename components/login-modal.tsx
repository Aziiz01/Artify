import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/hook/use-login-modal";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";

export const LoginModal = () => {
  const loginModal = useLoginModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onLogin = async () => {
    router.push("/sign-in");
    loginModal.onClose();
  };

  const onSignup = async () => {
    router.push("/sign-up");
    loginModal.onClose();
  };
// missing some more design
  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent className="bg-[#111827] rounded-lg shadow-md text-white">
      <div className="relative">
  <Image
    alt="bg"
    src="/cyberpunk.jpg"
    width={500}
    height={300}
  />
  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold" style={{ fontSize: '26px', whiteSpace: 'nowrap' }}>Sign in to start creating</p>
</div>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">
          Observe your prompts evolving into stunning designs, artworks, images, music, and even videos.
          </h2>
          <p className="text-gray-300">
          Imaginify transforms your concepts into reality.
</p>

          <DialogFooter className="mt-4">
  <Button
    disabled={loading}
    onClick={onLogin}
    size="lg"
    className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white"
  >
    Log In
  </Button>
  <Button
    disabled={loading}
    onClick={onSignup}
    size="lg"
    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
  >
    Sign Up
  </Button>
</DialogFooter>

        </div>
        <p className="text-gray-300">
        By continuing, you confirm that you have read, understood, and
agreed to our Terms of Use and Privacy Policy.
          </p>
      </DialogContent>
    </Dialog>
  );
};
