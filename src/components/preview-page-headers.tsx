"use client"

import { toast } from "react-toastify"

export function PreviewHeaders() {
  return (
<>
<div
					id="navbar"
					className=" bg-gray-900"
				>
					<div className="flex items-center justify-center">
						<div className="text-center flex-grow"><p className="mr-2">Welcome guest user</p></div>
						<button
							className="rounded border border-blue-500 bg-sky-950 px-4 py-2 font-semibold text-gray-300 hover:border-transparent hover:bg-blue-500 hover:text-white"
							onClick={() => {toast("Cannot sign out in preview mode.")}}
						>
							Sign out
						</button>
					</div>
				</div>

				
				
</>
  )
}