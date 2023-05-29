import { signIn, signOut, useSession } from "next-auth/react";

import BasicCard from "@/components/card-item";
import { Form1 } from "@/components/form-component";
import TestComponent from "@/components/test-component";
import WelcomeSignout from "../../components/welcome-signout";

// Import the functions you need from the SDKs you need

export default function TestPage() {
	return (
		<>
			<WelcomeSignout />
			<Form1 />
			<TestComponent />
			<BasicCard text="test12345"/>
		</>
	);
}
