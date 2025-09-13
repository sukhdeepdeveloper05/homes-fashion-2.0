import { getAuthUser } from "@/actions/user";
import CheckoutContent from "./content";
import Script from "next/script";

export const revalidate = 0;

export default async function CheckoutPage({ params }) {
  const user = await getAuthUser();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <Script
        src="https://www.unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js"
        async
      ></Script>
      <CheckoutContent params={params} isLoggedIn={!!user} />
    </>
  );
}
