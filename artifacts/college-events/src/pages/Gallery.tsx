import { AppLayout } from "@/components/layout/AppLayout";
import { useGetGallery } from "@workspace/api-client-react";

export default function Gallery() {
  const { data: images, isLoading } = useGetGallery();

  return (
    <AppLayout>
      <div className="bg-primary/5 pt-20 pb-12 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-primary mb-4">Event Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Memories and highlights from past technical and cultural events at PSCMR-CET.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className={`bg-muted animate-pulse rounded-2xl w-full ${i % 2 === 0 ? 'h-64' : 'h-96'}`} />
            ))}
          </div>
        ) : images && images.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((img) => (
              <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden mb-6">
                <img 
                  src={img.imageUrl} 
                  alt={img.title} 
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg">{img.title}</h3>
                  <p className="text-white/80 text-sm">{img.eventName} • {img.year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">More photos coming soon...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
