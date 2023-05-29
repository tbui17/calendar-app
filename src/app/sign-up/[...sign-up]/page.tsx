import { SignUp } from "@clerk/nextjs/app-beta";

export default function Page() {



  return(
    <section className="py-28">
    <div className='container'>
        <div className="flex justify-center">
        <SignUp />;
        </div>
    </div>
</section>
  )
}

