import { authConfig } from "@/pages/api/auth/[...nextauth]"
import { Session, getServerSession } from "next-auth"
import { LogoutButton } from "@/src/auth/LogoutButton";


export const User = async () => {
    const session = await getServerSession(authConfig);
    if(!session?.user){
        return <p>No user</p>
    }

    return (
        <div>
            <img src={session.user.image ?? ''}></img>
            <p>{session.user.name}</p>
            <LogoutButton/>
        </div>
    )
}