import ContactForm from "@/components/user/ContactForm";

export const metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="bg-white px-6 w-full container my-auto">
      <div className="py-24">
        <h1 className="text-4xl font-semibold mb-8 text-center">Contact us</h1>

        <ContactForm />
      </div>
    </div>
  );
}
