import 'next-auth';
import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth'{
    
    interface User{
        _id ?: string;
        isVerified ?: boolean;
        isAcceptingMess ?: boolean;
        username ?: string
    }
    interface Session{
        user : {
            _id ?: string;
            isVerified ?: boolean;
            isAcceptingMess ?: boolean;
            username ?: string
        } & DefaultSession['user']
    }
   
}

// or 

declare module 'nextauth/jwt' {
    interface JWT{
        _id ?: string;
        isVerified ?: boolean;
        isAcceptingMess ?: boolean;
        username ?: string
    }
}