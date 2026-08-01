import Image from "next/image";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/reference-assets/logo-sodre-santoro-transparent.png"
        alt="Sodré Santoro"
        fill
        className="object-contain object-center xl:object-left"
        sizes="(max-width: 768px) 220px, 320px"
        priority
      />
    </div>
  );
}
