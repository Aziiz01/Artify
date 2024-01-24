import {create} from 'zustand';

interface ImageStore {
  base64Images: string[];
  setBase64Images: (elements: string[]) => void;
}

const useImageStore = create<ImageStore>((set) => ({
    base64Images: [],
    setBase64Images: (elements) => set({ base64Images: elements }),
}));

export default useImageStore;