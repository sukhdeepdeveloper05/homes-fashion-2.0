import { Card, CardContent } from "@/components/shadcn/card";
import ProfileForm from "./form";
import { getData } from "@/lib/api";

export const revalidate = 0;

export default async function ProfilePage() {
  const { data } = await getData({ url: "/customers", requiresAuth: true });

  console.log(data)

  return (
    <Card className="w-full border-0 shadow-none py-0">
      <CardContent className="p-0">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <ProfileForm details={data} />
      </CardContent>
    </Card>
  );
}
