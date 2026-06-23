"use client"


import {
Avatar,
AvatarFallback,
AvatarImage
} from "@/components/ui/avatar"


import {
Popover,
PopoverContent,
PopoverTrigger
} from "@/components/ui/popover"


import {
Separator
} from "@/components/ui/separator"


import {
Button
} from "@/components/ui/button"


import {
useSession,
signOut
} from "next-auth/react"



export default function UserMenu(){


const {data:session}=useSession()



if(!session?.user){
return null
}



const name =
session.user.name ??
"User"


const initials =
name
.split(" ")
.map(
x=>x[0]
)
.join("")
.toUpperCase()



return (

<Popover>


<PopoverTrigger asChild>

<Button
variant="ghost"
className="relative h-10 w-10 rounded-full"
>


<Avatar>


<AvatarImage
src={
session.user.image ??
""
}
/>


<AvatarFallback>

{initials}

</AvatarFallback>


</Avatar>


</Button>


</PopoverTrigger>



<PopoverContent
className="w-64"
align="end"
>


<div className="flex gap-3">


<Avatar>

<AvatarImage
src={
session.user.image ??
""
}
/>

<AvatarFallback>
{initials}
</AvatarFallback>


</Avatar>



<div className="flex flex-col">

<p className="font-medium">

{session.user.name}

</p>


<p className="text-sm text-muted-foreground">

{session.user.email}

</p>


</div>


</div>



<Separator
className="my-4"
/>



<div className="space-y-1">


<Button
variant="ghost"
className="w-full justify-start"
>

Profile

</Button>


<Button
variant="ghost"
className="w-full justify-start"
>

Settings

</Button>



<Button
variant="ghost"
className="w-full justify-start"
onClick={()=>signOut()}
>

Logout

</Button>


</div>



</PopoverContent>


</Popover>

)

}