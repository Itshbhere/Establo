import Link from "next/link";

const CustomButton = ({ marginTop = "mt-[22px]" }) => {
  return (
    <Link href="/contact">
      <button
        className={`group inline-flex items-center gap-2 bg-[var(--lightBlue)] text-white rounded-3xl px-6 py-2 ${marginTop} transition-all duration-300 shadow-none hover:bg-[var(--darkBlue)] hover:shadow-lg`}
      >
        <span className="text-base font-medium">Book an Appointment</span>
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:rotate-[-45deg]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
      </button>
    </Link>
  );
};

export default CustomButton;
