import logo from "@/assets/images/logo.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Help Desk", href: "#" },
      { label: "Support", href: "#" },
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
    <footer className="bg-background-secondary pt-20">
      <div className="container">
        <div className="flex justify-between">
          <div className="flex flex-col max-w-96">
            <Image
              src={logo}
              alt="logo"
              priority
              className={cn("max-w-32 transition-opacity duration-200")}
            />

            <p className="text-foreground-primary mt-6">
              Creating cutting-edge home services that revolutionize the way
              households operate and improve user satisfaction globally.
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
          <div className="grid grid-cols-3 gap-32">
            {footerLinks.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-xl text-foreground-primary font-semibold mb-6">
                  {section.title}
                </h2>
                <ul className="space-y-2">
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

        <div className="border-t border-gray-300 mt-12 py-8 text-xs text-center">
          <p>
            © Copyright {new Date().getFullYear()}{" "}
            {process.env.NEXT_PUBLIC_APP_NAME} Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
