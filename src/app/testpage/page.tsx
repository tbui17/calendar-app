"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { CalendarApp } from "@/components/calendar-components/calendar";
import { Form1 } from "@/components/form-component";
import TestComponent from "@/components/test-component";
import WelcomeSignout from "../../components/welcome-signout";

// Import the functions you need from the SDKs you need

export default function TestPage() {
	return (
		<div>
			<WelcomeSignout />
			<Form1 />
			<TestComponent />
		</div>
	);
}
