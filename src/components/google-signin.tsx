import { GoogleLogin } from '@react-oauth/google';

export const GoogleSignInButton = () =>{

return <GoogleLogin
  onSuccess={credentialResponse => {
    
    const accessToken = credentialResponse.credential
    if (!accessToken){
        console.error('Google could not authenticate');
    }
    else {
        localStorage.setItem("accessToken", accessToken)
    }
    
  }}
  onError={() => {
    console.error('Login Failed');
  }}
/>;
}