import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import BannerEnquiryForm from "./BannerEnquiryForm";

const bannerSlides = [
  {
    mobile: "/avacasa-banners/Web-Banners_green.webp",
    tablet: "/avacasa-banners/Web-Banners_green-2.webp",
    desktop: "/avacasa-banners/Web-Banners_green-4.webp",
    alt: "AVACASA luxury villas - slide 1",
  },
  {
    mobile: "/avacasa-banners/Web-Banners_-light.webp",
    tablet: "/avacasa-banners/Web-Banners_light-2.webp",
    desktop: "/avacasa-banners/Web-Banners_light-4.webp",
    alt: "AVACASA luxury villas - slide 2",
  },
];

const AvacasaBannerSlider = () => {
  return (
    <div className="relative w-full aspect-[458/810] md:aspect-[1000/1230] lg:aspect-[1920/920] bg-[#0e291a]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        speed={900}
        className="h-full w-full [&_.swiper-wrapper]:h-full [&_.swiper-slide]:h-full"
      >
        {bannerSlides.map((slide, index) => (
          <SwiperSlide key={slide.desktop} className="h-full w-full">
            <picture className="flex h-full w-full items-start justify-center">
              <source
                media="(min-width: 1024px)"
                srcSet={slide.desktop}
                type="image/webp"
              />
              <source
                media="(min-width: 768px)"
                srcSet={slide.tablet}
                type="image/webp"
              />
              <img
                src={slide.mobile}
                alt={slide.alt}
                width={index === 0 ? 458 : undefined}
                height={index === 0 ? 810 : undefined}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                className="block w-full h-full object-contain object-top"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Desktop only — hidden on phone / tablet */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:flex items-end justify-end pr-6 xl:pr-12 2xl:pr-16 pb-4 lg:pb-4 xl:pb-6 2xl:pb-8">
        <BannerEnquiryForm />
      </div>
    </div>
  );
};

export default AvacasaBannerSlider;
