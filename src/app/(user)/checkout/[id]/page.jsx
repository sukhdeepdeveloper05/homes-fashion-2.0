import { getAuthUser } from "@/actions/user";
import CheckoutContent from "./content";
import Script from "next/script";

export const revalidate = 0;

export default async function CheckoutPage({ params }) {
  const user = await getAuthUser();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <CheckoutContent params={params} isLoggedIn={!!user} />
    </>
  );
}
