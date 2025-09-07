import { getAuthUser } from "@/actions/user";
import UserFooter from "@/components/user/ui/Footer";
import UserHeader from "@/components/user/ui/Header";
import { CartProvider } from "@/store/cartContext";
import ProductContextProvider from "@/store/productContext";

export default async function UserLayout({ children }) {
  const user = await getAuthUser();

  console.log("token", user?.token);

  return (
    <>
      <CartProvider>
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
