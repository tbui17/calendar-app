export default function handler(req: any, res: any) {
	if (req.method === "POST") {
		console.log(req.json());
		return;
	} else {
		return;
	}
}
