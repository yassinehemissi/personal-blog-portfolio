"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

export interface BlogGalleryImage {
  src: string;
  title: string;
  alt: string;
  german: string;
  french: string;
}

export interface BlogGallery {
  images: BlogGalleryImage[];
  germanSource: string;
  frenchSource: string;
  translationCredit: string;
}

export function BlogImageGallery({ gallery }: { gallery: BlogGallery }) {
  const [selected, setSelected] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const image = selected === null ? null : gallery.images[selected];
  const move = (offset: number) => setSelected((current) =>
    current === null ? null : (current + offset + gallery.images.length) % gallery.images.length
  );

  return (
    <section lang="fr" aria-label="Galerie des cinq interprétations en sfumato" className="my-10">
      <p className="mb-4 text-sm text-muted-foreground">Cinq passages, cinq tableaux. Cliquez sur une image pour découvrir le texte qui l’a inspirée.</p>
      <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {gallery.images.map((item, index) => (
            <button
              key={item.src}
              type="button"
              aria-haspopup="dialog"
              aria-label={`Agrandir : ${item.title}`}
              onClick={(event) => { trigger.current = event.currentTarget; setSelected(index); }}
              className={`group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left shadow-sm transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary dark:border-slate-800 dark:bg-slate-900 ${index === 0 ? "sm:col-span-2" : ""}`}
            >
              <div className="relative overflow-hidden">
                <img src={item.src} alt={item.alt} width={2048} height={1152} loading="lazy" className="aspect-video w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]" />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"><Expand size={16} aria-hidden="true" /></span>
              </div>
              <span className="flex items-center gap-3 px-4 py-3 text-sm"><span className="text-muted-foreground">0{index + 1}</span><span>{item.title}</span></span>
            </button>
          ))}
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md" />
          <Dialog.Content
            lang="fr"
            className="fixed left-1/2 top-1/2 z-50 max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/15 bg-white text-slate-900 shadow-2xl dark:bg-slate-950 dark:text-slate-100"
            onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus(); }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
              if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
            }}
          >
            {image && (
              <>
                <div className="flex items-center justify-between gap-4 px-5 py-4 pr-16">
                  <Dialog.Title className="font-medium">{image.title}</Dialog.Title>
                  <span className="shrink-0 text-sm text-muted-foreground">{(selected ?? 0) + 1} / {gallery.images.length}</span>
                </div>
                <Dialog.Close aria-label="Fermer la galerie" className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-slate-100 focus-visible:outline-2 dark:hover:bg-slate-800"><X size={20} /></Dialog.Close>
                <div className="bg-black/95"><img src={image.src} alt={image.alt} width={2048} height={1152} className="max-h-[55dvh] w-full object-contain" /></div>
                <Dialog.Description className="sr-only">Tableau accompagné de son passage original en allemand et de la traduction française d’Henri Albert.</Dialog.Description>
                <div aria-live="polite" className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
                  <div><h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Texte original · Allemand</h3><blockquote lang="de" className="font-serif text-lg leading-relaxed">{image.german}</blockquote></div>
                  <div><h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Traduction · Français</h3><blockquote className="font-serif text-lg leading-relaxed">{image.french}</blockquote></div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                  <button type="button" onClick={() => move(-1)} aria-label="Image précédente" className="rounded-full border p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowLeft size={20} /></button>
                  <p className="text-center text-xs text-muted-foreground">{gallery.translationCredit}<br /><a className="underline" href={gallery.germanSource} target="_blank" rel="noopener noreferrer">Original allemand</a>{" · "}<a className="underline" href={gallery.frenchSource} target="_blank" rel="noopener noreferrer">Source française</a></p>
                  <button type="button" onClick={() => move(1)} aria-label="Image suivante" className="rounded-full border p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowRight size={20} /></button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Friedrich Nietzsche, <em>Les trois métamorphoses</em>. {gallery.translationCredit}{" "}<a href={gallery.frenchSource} target="_blank" rel="noopener noreferrer" className="underline">Lire la traduction sur Wikisource.</a></p>
    </section>
  );
}
