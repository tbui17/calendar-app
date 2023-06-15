export function oneMonthAheadYYYYMMDD(){
	const date = new Date()
	date.setMonth(date.getMonth() + 1)
	return date.toISOString().split("T")[0]
}

export function oneMonthBehindYYYYMMDD(){
	const date = new Date()
	date.setMonth(date.getMonth() - 1)
	return date.toISOString().split("T")[0]
}

export function oneMonthAhead(){
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
}

export function oneMonthBehind(){
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date
}