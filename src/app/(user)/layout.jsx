import { getAuthUser } from "@/actions/user";
import UserFooter from "@/components/user/ui/Footer";
import UserHeader from "@/components/user/ui/Header";
import { CartProvider } from "@/store/cartContext";
import ProductContextProvider from "@/store/productContext";
import Script from "next/script";

export default async function UserLayout({ children }) {
  const user = await getAuthUser();

  return (
    <>
      <Script
        src="https://www.unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js"
        async
      ></Script>
      <CartProvider user={user}>
        <ProductContextProvider>
          <UserHeader user={user} />
          <main className="flex-1 flex flex-col relative mt-(--header-height)">
            {children}
          </main>
          <UserFooter />
        </ProductContextProvider>
      </CartProvider>
    </>
  );
}
