import {
 Html,
 Body,
 Container,
 Text,
 Button,
 Heading
} from "@react-email/components"



export default function ResetPasswordEmail({
 url
}:Readonly<{
 url:string
}>){


return (

<Html>

<Body>

<Container>


<Heading>
Reset your password
</Heading>


<Text>
You requested to reset your password.
</Text>


<Button
href={url}
style={{
background:"#000",
color:"#fff",
padding:"12px 20px",
borderRadius:"8px"
}}
>

Reset password

</Button>


<Text>
This link expires in 1 hour.
</Text>


</Container>


</Body>

</Html>

)

}