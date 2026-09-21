import Image from "next/image";

const photos = [
  { id: 5, title: "Cuidado com a unidade externa", alt: "Imagem ilustrativa de limpeza de uma condensadora" },
  { id: 1, title: "Atenção aos filtros", alt: "Imagem ilustrativa de retirada dos filtros de um split" },
  { id: 2, title: "Manutenção do split", alt: "Imagem ilustrativa de técnico junto a um split aberto" },
  { id: 4, title: "Higienização da unidade interna", alt: "Imagem ilustrativa de higienização da evaporadora com proteção" },
  { id: 3, title: "Inspeção da condensadora", alt: "Imagem ilustrativa de técnico inspecionando a unidade externa" },
];

export default function ServiceGallery() {
  return (
    <section className="service-gallery wrap" id="galeria" aria-labelledby="gallery-title">
      <div className="gallery-heading">
        <div>
          <p className="eyebrow">CUIDADO EM CADA ETAPA</p>
          <h2 id="gallery-title">Seu conforto.<br /><span>Nos detalhes do cuidado.</span></h2>
        </div>
        <p>Conheça alguns dos cuidados com o seu ar-condicionado.</p>
      </div>
      <div className="gallery-grid">
        {photos.map((photo) => (
          <figure key={photo.id} className={`gallery-photo gallery-photo-${photo.id}`}>
            <div className="gallery-image">
              <Image src={`/gallery/service-${photo.id}.png`} alt={photo.alt} fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 40vw" />
            </div>
            <figcaption>{photo.title}</figcaption>
          </figure>
        ))}
      </div>
      <p className="gallery-note">Imagens ilustrativas. Não representam serviços realizados pela JB Refrigeração.</p>
    </section>
  );
}
