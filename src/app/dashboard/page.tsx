import { SignOutButton } from "@/components/auth/signout-button";
import UserMenu from "@/components/auth/user-menu";




export default function Page ()  {
  return (
    <div>
      <header className="h-16 border-b flex items-center justify-end px-6">


<UserMenu/>
        <SignOutButton variant="outline"/>

</header>
        dashboard

    </div>
  );
};
