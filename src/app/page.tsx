"use client";

import { UserButton, currentUser } from "@clerk/nextjs";

import { CalendarApp } from "../components/calendar-components/calendar";

// Import the functions you need from the SDKs you need


export default async function Home() {
	

	return (
	<>
	<div>
      <UserButton afterSignOutUrl="/"/>
    </div>
	<CalendarApp />
	</>
	)
}
