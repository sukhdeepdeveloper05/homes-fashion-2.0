import ContactForm from "@/components/user/ContactForm";

export const metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="bg-white container">
      <div className="py-12 md:py-16 lg:py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">Contact us</h1>

        <ContactForm />
      </div>
    </div>
  );
}
