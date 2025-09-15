import logo from "@/assets/images/logo.webp";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import Logo from "@/components/ui/Logo";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Cart", href: "/cart" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "Categories",
    links: [
      {
        label: "House Cleaning",
        href: "/collections/6873c643a60ff627016702ee",
      },
      { label: "Painting", href: "/collections/68bee6d36f8cd90948e532a9" },
      { label: "Renovation", href: "/collections/68c6cd986b7f9ed03ff446f6" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Linkedin", href: "#", icon: <FaLinkedinIn /> },
  { label: "Twitter", href: "#", icon: <FaTwitter /> },
  { label: "Facebook", href: "#", icon: <FaFacebookF /> },
];

export default function UserFooter() {
  return (
    <footer className="bg-background-secondary pt-10 sm:pt-16 lg:pt-20">
      <div className="container">
        <div className="flex max-lg:flex-col justify-between gap-10 lg:gap-5">
          <div className="flex flex-col w-full lg:max-w-96">
            <div>
              {/* <Image
              src={logo}
              alt="logo"
              priority
              className={cn("max-w-32 transition-opacity duration-200")}
            /> */}
              <Logo />
            </div>

            <p className="text-foreground-primary mt-5 leading-[1.8]">
              India’s trusted home service platform offering professional,
              affordable, and reliable solutions for every household need.
            </p>

            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((link, idx) => (
                <Link
                  href={link.href}
                  key={link.label + idx}
                  className="text-foreground-primary p-3 bg-white rounded-full border border-transparent hover:border-gray-300 transition"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 sm:gap-5 lg:gap-16 xl:gap-36">
            {footerLinks.map((section, idx) => (
              <div key={idx} className="w-full">
                <h2 className="text-xl text-foreground-primary font-semibold mb-4 sm:mb-6">
                  {section.title}
                </h2>
                <ul className="space-y-2.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-foreground-primary "
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-10 sm:mt-16 lg:mt-20 py-4 md:py-5 lg:py-6 px-5 text-sm text-center">
        <p>
          © Copyright {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
