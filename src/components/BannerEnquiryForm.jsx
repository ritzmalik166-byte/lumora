import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaCommentDots,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { sendLeadEmailNotification } from "@/lib/notifyLead";

const emptyFormData = {
  Name: "",
  Phone: "",
  Email: "",
  City: "",
  Remark: "",
  RequestCallBack: true,
};

const PHONE_REGEX = /^\d{10}$/;

const SuccessTick = () => (
  <div
    className="flex min-h-[280px] sm:min-h-[320px] flex-col items-center justify-center px-2 py-6 text-center"
    role="status"
    aria-live="polite"
  >
    <div className="banner-tick-wrap">
      <svg
        className="h-[64px] w-[64px] sm:h-[72px] sm:w-[72px]"
        viewBox="0 0 52 52"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="banner-tick-circle"
          cx="26"
          cy="26"
          r="24"
          stroke="#cc9a64"
          strokeWidth="2.5"
          fill="rgba(204, 154, 100, 0.12)"
        />
        <path
          className="banner-tick-check"
          d="M14.5 27.2L22.2 34.5L37.5 18"
          stroke="#cc9a64"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <p className="banner-tick-message mt-5 font-cinzel text-[15px] tracking-[0.08em] text-mainText uppercase">
      Request Received
    </p>
    <p className="banner-tick-message mt-2 font-poppins text-[12px] leading-relaxed text-white/80">
      Thank you! We will get back to you shortly.
    </p>
  </div>
);

/**
 * @param {{ onClose?: () => void, showClose?: boolean, source?: string, className?: string }} props
 */
const BannerEnquiryForm = ({
  onClose,
  showClose = false,
  source = "banner-enquiry",
  className = "",
}) => {
  const [formData, setFormData] = useState(emptyFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setFormData(emptyFormData);
    setErrors({});
    setSubmitStatus(null);
    setErrorMessage("");
    setIsLoading(false);
    onClose?.();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "Phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        Phone: phoneValue,
      }));

      if (PHONE_REGEX.test(phoneValue) || !phoneValue) {
        setErrors((prev) => ({ ...prev, Phone: "" }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    if (submitStatus) {
      setSubmitStatus(null);
      setErrorMessage("");
    }
  };

  const handlePhoneBlur = () => {
    if (!formData.Phone) {
      setErrors((prev) => ({
        ...prev,
        Phone: "Please enter a valid 10-digit mobile number",
      }));
      return;
    }

    if (!PHONE_REGEX.test(formData.Phone)) {
      setErrors((prev) => ({
        ...prev,
        Phone: "Please enter a valid 10-digit mobile number",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    const city = formData.City.trim();

    if (!PHONE_REGEX.test(formData.Phone)) {
      nextErrors.Phone = "Please enter a valid 10-digit mobile number";
    }

    if (!city) {
      nextErrors.City = "Please enter your city name";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);
    setErrors({});

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB");
    const message = formData.RequestCallBack
      ? "Request a Call Back"
      : "Banner enquiry";

    try {
      const params = new URLSearchParams();
      params.append("sheetName", "Sheet1");
      params.append("Name", formData.Name);
      params.append("Email", formData.Email);
      params.append("Phone", formData.Phone);
      params.append("InvestmentBudget", "");
      params.append("BuyingPurpose", "");
      params.append("PurchaseTimeline", "");
      params.append("City", city);
      params.append("Message", message);
      params.append("Remark", formData.Remark.trim());
      params.append("Date", formattedDate);
      params.append("Time", formattedTime);

      await fetch(
        "https://script.google.com/macros/s/AKfycbxK4wLY5THDlE1uUeoOWxemDaH2NsOl_3tjWrHTrry_g8E8M25Gmq0KRCixhK6FgDiL2g/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: params,
        }
      );

      sendLeadEmailNotification({
        source,
        Name: formData.Name,
        Email: formData.Email,
        Phone: formData.Phone,
        InvestmentBudget: "",
        BuyingPurpose: "",
        PurchaseTimeline: "",
        City: city,
        Message: message,
        Remark: formData.Remark.trim(),
        Date: formattedDate,
        Time: formattedTime,
      });

      setSubmitStatus("success");
      setFormData(emptyFormData);
      setErrors({});
      setTimeout(() => {
        setSubmitStatus(null);
        onClose?.();
      }, 4500);
    } catch (error) {
      console.error("Banner form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("Unable to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      name: "Name",
      type: "text",
      placeholder: "Client Name",
      icon: FaUser,
      required: true,
      autoComplete: "name",
    },
    {
      name: "Phone",
      type: "tel",
      placeholder: "Mobile Number",
      icon: FaPhoneAlt,
      required: true,
      autoComplete: "tel",
      pattern: "[0-9]{10}",
      title: "Please enter a 10-digit phone number",
      inputMode: "numeric",
    },
    {
      name: "Email",
      type: "email",
      placeholder: "Email ID",
      icon: FaEnvelope,
      required: true,
      autoComplete: "email",
    },
    {
      name: "City",
      type: "text",
      placeholder: "City Name",
      icon: FaMapMarkerAlt,
      required: true,
      autoComplete: "address-level2",
    },
    {
      name: "Remark",
      type: "text",
      placeholder: "Remark",
      icon: FaCommentDots,
      required: false,
      autoComplete: "off",
    },
  ];

  return (
    <div
      className={`pointer-events-auto w-full max-w-[300px] sm:max-w-[340px] ${className}`}
    >
      <div className="relative rounded-xl border border-mainText/80 bg-[#0e291a]/95 px-5 py-4 sm:px-6 sm:py-5 lg:px-5 lg:py-4 xl:px-6 xl:py-5 2xl:py-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-[2px]">
        {showClose && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-mainText/80 hover:bg-white/10 hover:text-mainText transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        )}

        {submitStatus === "success" ? (
          <SuccessTick />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3 lg:mb-2.5 xl:mb-3.5 2xl:mb-4 text-center">
              <h2 className="font-cinzel text-[17px] sm:text-[19px] xl:text-[20px] tracking-[0.12em] text-mainText uppercase">
                Enquire Now
              </h2>
              <div className="mx-auto mt-1.5 xl:mt-2 flex items-center justify-center gap-2 text-mainText">
                <span className="h-px w-8 bg-mainText/70" />
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 0L8.2 3.8L12.5 3.8L9.1 6.2L10.4 10L7 7.6L3.6 10L4.9 6.2L1.5 3.8L5.8 3.8L7 0Z" />
                </svg>
                <span className="h-px w-8 bg-mainText/70" />
              </div>
            </div>

            <div className="space-y-2 lg:space-y-2 xl:space-y-2.5">
              {fields.map(({ icon: Icon, name, ...inputProps }) => (
                <div key={name}>
                  <label
                    className={`flex items-center gap-2.5 rounded-md bg-white px-3 py-2 lg:py-2 xl:py-2.5 focus-within:ring-2 focus-within:ring-mainText ${
                      errors[name] ? "ring-2 ring-red-500" : ""
                    }`}
                  >
                    <Icon
                      className="h-4 w-4 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      onBlur={name === "Phone" ? handlePhoneBlur : undefined}
                      className="w-full min-w-0 bg-transparent text-[12.5px] sm:text-[13px] xl:text-sm text-greenTheme placeholder:text-gray-400 outline-none"
                      {...inputProps}
                    />
                  </label>
                  {errors[name] && (
                    <p className="mt-1 px-1 text-[11px] text-red-400">
                      {errors[name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <label className="mt-2.5 lg:mt-2.5 xl:mt-3 2xl:mt-3.5 flex cursor-pointer items-center gap-2.5 select-none">
              <span className="relative flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  name="RequestCallBack"
                  checked={formData.RequestCallBack}
                  onChange={handleInputChange}
                  className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                <span className="flex h-full w-full items-center justify-center rounded-[3px] border border-mainText bg-transparent peer-checked:bg-mainText">
                  <svg
                    className={`h-3 w-3 text-greenTheme ${
                      formData.RequestCallBack ? "opacity-100" : "opacity-0"
                    }`}
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6.2L4.6 9L10 3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
              <span className="font-poppins text-[12px] sm:text-[13px] text-mainText">
                Request a Call Back
              </span>
            </label>

            {submitStatus === "error" && (
              <p className="mt-3 rounded-md bg-red-100 px-3 py-2 text-center text-xs text-red-700">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-3 lg:mt-3 xl:mt-3.5 2xl:mt-4 w-full rounded-md py-2.5 lg:py-2.5 xl:py-3 px-4 font-poppins text-[12px] sm:text-[13px] font-semibold tracking-[0.06em] uppercase transition-all duration-300 ${
                isLoading
                  ? "cursor-not-allowed bg-gray-400 text-gray-600"
                  : "bg-gradient-to-b from-[#dfb57a] to-[#cc9a64] text-greenTheme hover:from-[#e8c48c] hover:to-[#d4a874]"
              }`}
            >
              {isLoading ? "Submitting..." : "Request a Call Back"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/** Responsive modal wrapper — same form as the desktop banner */
export const BannerEnquiryPopup = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/55 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Enquire Now"
      >
        <div
          className="my-auto w-full max-w-[300px] sm:max-w-[340px]"
          onClick={(e) => e.stopPropagation()}
        >
          {isOpen ? (
            <BannerEnquiryForm
              showClose
              onClose={onClose}
              source="callback-enquiry"
              className="max-w-none"
            />
          ) : null}
        </div>
      </div>
    </>,
    document.body
  );
};

export default BannerEnquiryForm;
