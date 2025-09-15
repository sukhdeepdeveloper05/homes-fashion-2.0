import ServiceSearch from "../ui/ServiceSearch";

export default function HeroSection({ collections }) {
  return (
    <>
      <section className="hero bg-black text-white h-screen max-h-[700px] relative -mt-(--header-height) flex flex-col items-center justify-center">
        {/* <Image
        src={heroBanner}
        priority
        alt=""
        width={1280}
        height={100}
        className="w-full object-cover object-top h-full absolute inset-0"
      /> */}

        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src="/house-cleaning.mp4" type="video/mp4" />
          </video>
          <div className="bg-black/50 absolute inset-0 "></div>
        </div>

        <div className="container mx-auto">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center space-y-5 sm:space-y-7">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold">
                Find Trusted Experts —{" "}
                <span className="text-accent-secondary font-bold">
                  Fast & Free
                </span>
              </h1>
              <p className="text-lg leading-relaxed">
                Connect with top-rated experts who are skilled, reliable, and
                ready to help. No hidden fees, no hassle—just fast and free
                access to the right talent for your needs.
              </p>
              {/* <p className="text-2xl">Discover Top Experts in</p>
            <p className="text-accent-secondary font-bold text-2xl">
              Skilled, Trusted, Reliable!
            </p> */}
            </div>
            <div className="bg-white rounded-lg flex items-center mt-8 sm:mt-10 max-w-[540px] mx-auto">
              {/* <div className="flex items-center gap-1.5 max-w-3xs w-full">
              <HiOutlineLocationMarker className="text-xl text-foreground-tertiary min-w-5" />
              <input
                type="text"
                placeholder="Search for a city..."
                className="text-foreground-primary text-sm w-full inline-flex"
              />
            </div>

            <div className="devider min-w-0.5 h-7 mx-1 bg-foreground-tertiary/20 rounded-full" /> */}

              <ServiceSearch />
            </div>
          </div>
        </div>
      </section>

      {/* <section className="container !px-0 relative z-10 -mt-20 mb-20 bg-white rounded-xl shadow w-fit mx-auto">
        <div className="bg-background-secondary py-3.5 px-4 rounded-t-xl">
          <h3 className="text-foreground-primary font-bold text-center text-lg">
            What are you looking for?
          </h3>
        </div>

        <div className="flex justify-between py-5 px-6 gap-8">
          {collections.slice(0, 8).map((collection) => (
            <Link
              href={`/collections/${collection.id}`}
              key={collection.id}
              className="max-w-[140px] w-full"
            >
              <Image
                src={MEDIA_URL + collection.featuredImage.src}
                alt=""
                width={320}
                height={320}
                className="aspect-square object-cover rounded-lg"
              />
              <p className="text-foreground-primary font-medium text-center mt-3">
                {collection.title}
              </p>
            </Link>
          ))}
        </div>
      </section> */}
    </>
  );
}
