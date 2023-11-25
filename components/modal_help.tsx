"use client";

import axios from "axios";
import { useState } from "react";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

import { useProModal } from "@/hook/use-pro-modal";


export const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading] = useState(false);



    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold text-xl">
                            All about text prompts

                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                    <p>
              The text prompt is a place for you to describe - in words - what
              you want the AI to create. Use the shuffle icon to generate random
              prompts. Try it, it is fun!
              Use grandiose words to get the AI to understand exactly what it is you want it to generate. For example, the term garden is a good prompt but lush garden or celestial garden better describes to the AI what it is exactly you would like it to make. If you’re still looking for more inspiration, try the random or choose options to create with one of our pre-written prompts.

Styles (Presets and Modifiers)
Modifiers are the descriptive words in a text prompt that describe to the AI what you want to make and how you want it to look. What art style are you going for? Oil painting? Pencil sketch? Art Deco? What color pallete do you want to show through the most? Do you want it to look more animated or realistic? Modifiers are how you can direct this all. If you’re still feeling uninspired, try our list of modifiers under the add modifiers button.

Presets are simply a bunch of modifiers, chosen by us, that are well tested and likely to achieve a good result.

Coherent
When using the Coherent algorithm, try to be more blunt and to the point when describing what it is you’d like to create. This helps to prevent the AI from straying off the path of what the subject of the creation is.

Artistic
When using the Artistic algorithm, try to describe as accurately as possible what it is you want to create. What artist styles, scenes, subjects, colors, and/or textures do you want to see in the final image? For example, the term garden can be used as a prompt but lush colorful garden full of flowers during a light drizzle or celestial garden with alien vegetation during an outdoor picnic better describes to the AI what it is exactly you would like it to make.

Try multiple prompt sets
In Advanced mode, turning on Try multiple prompt sets allows you to generate multiple creations in one go. One creation will be generated for each prompt set you specify.

Note that the reason it is a prompt set and not just Try multiple prompts is that a single creation can itself have multiple prompts. That means that each prompt set will result in a single creation made up of one or more prompts.

When Try multiple prompt sets is turned on, you can duplicate an existing prompt set and then make whatever changes you like. For example, you might use a different modifier, or slightly change the prompt in other ways.
            </p>
                    </DialogDescription>
                </DialogHeader>
                
            </DialogContent>
        </Dialog>
    );
};
