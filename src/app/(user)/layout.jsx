import { getAuthUser } from "@/actions/user";
import UserFooter from "@/components/user/ui/Footer";
import UserHeader from "@/components/user/ui/Header";
import { CartProvider } from "@/store/cartContext";
import { ErrorProvider } from "@/store/error";
import ProductContextProvider from "@/store/productContext";

export default async function UserLayout({ children }) {
  const user = await getAuthUser();

  return (
    <>
      <ErrorProvider>
        <CartProvider user={user}>
          <ProductContextProvider>
            <UserHeader user={user} />
            <main className="flex-1 flex flex-col relative mt-(--header-height)">
              {children}
            </main>
            <UserFooter />
          </ProductContextProvider>
        </CartProvider>
      </ErrorProvider>
    </>
  );
}
