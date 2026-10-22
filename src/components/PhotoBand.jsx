// A navy band with the campus photo behind it. Wrap any header or hero content in it.
// <PhotoBand className="py-20"> ...your heading and text... </PhotoBand>
export default function PhotoBand({ children, className = "", position = "50% 65%" }) {
  return (
    <section className={`relative isolate overflow-hidden bg-brand-dark text-white ${className}`}>
      <img
        src="/moba-campus.webp"
        srcSet="/moba-campus-640.webp 640w, /moba-campus.webp 1080w"
        sizes="100vw"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
      {/* Navy wash keeps white text readable and ties the photo to the brand colours */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(6,31,71,0.94) 0%, rgba(6,31,71,0.82) 45%, rgba(10,42,94,0.55) 100%)",
        }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}
