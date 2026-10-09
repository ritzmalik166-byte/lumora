import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import BannerEnquiryForm from "./BannerEnquiryForm";

const bannerSlides = [
  {
    mobile: "/avacasa-banners/new_web_banner_mobile.jpg",
    tablet: "/avacasa-banners/new_web_banner_tablet.jpg",
    desktop: "/avacasa-banners/new_web_banner_desktop.jpg",
    alt: "AVACASA luxury villas - slide 1",
    type: "image/jpeg",
  },
  {
    mobile: "/avacasa-banners/Web-Banners_-light.webp",
    tablet: "/avacasa-banners/Web-Banners_light-2.webp",
    desktop: "/avacasa-banners/Web-Banners_light-4.webp",
    alt: "AVACASA luxury villas - slide 2",
    type: "image/webp",
  },
];

const AvacasaBannerSlider = () => {
  return (
    <div className="relative w-full lg:aspect-[1920/920] bg-[#0e291a]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoHeight
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        speed={900}
        className="w-full lg:h-full [&_.swiper-wrapper]:lg:h-full [&_.swiper-slide]:lg:h-full"
      >
        {bannerSlides.map((slide, index) => (
          <SwiperSlide key={slide.desktop} className="h-full w-full">
            <picture className="block w-full">
              <source
                media="(min-width: 1024px)"
                srcSet={slide.desktop}
                type={slide.type}
              />
              <source
                media="(min-width: 768px)"
                srcSet={slide.tablet}
                type={slide.type}
              />
              <img
                src={slide.mobile}
                alt={slide.alt}
                width={index === 0 ? 768 : undefined}
                height={index === 0 ? 768 : undefined}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                className="block w-full h-auto lg:h-full lg:object-cover lg:object-top"
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
