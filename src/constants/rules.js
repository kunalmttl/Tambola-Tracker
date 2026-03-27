export const RULES = [
	{
		id: "EARLY_5",
		name: "Early 5",
		description: "First 5 numbers marked on the ticket",
		defaultEnabled: true,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			let count = 0;
			for (const row of ticket.grid) {
				for (const num of row) {
					if (num !== 0 && calledSet.has(num)) {
						count++;
					}
				}
			}
			return count >= 5;
		},
	},
	{
		id: "TOP_ROW",
		name: "Top Row / Breakfast",
		description: "All 5 numbers in the top row are marked",
		defaultEnabled: true,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			const nonZeros = ticket.grid[0].filter((n) => n !== 0);
			return (
				nonZeros.length > 0 && nonZeros.every((n) => calledSet.has(n))
			);
		},
	},
	{
		id: "MIDDLE_ROW",
		name: "Middle Row / Lunch",
		description: "All 5 numbers in the middle row are marked",
		defaultEnabled: true,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			const nonZeros = ticket.grid[1].filter((n) => n !== 0);
			return (
				nonZeros.length > 0 && nonZeros.every((n) => calledSet.has(n))
			);
		},
	},
	{
		id: "BOTTOM_ROW",
		name: "Bottom Row / Dinner",
		description: "All 5 numbers in the bottom row are marked",
		defaultEnabled: true,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			const nonZeros = ticket.grid[2].filter((n) => n !== 0);
			return (
				nonZeros.length > 0 && nonZeros.every((n) => calledSet.has(n))
			);
		},
	},
	{
		id: "CORNERS",
		name: "Corners",
		description: "1st and 5th numbers of the top and bottom rows",
		defaultEnabled: true,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			const topZeros = ticket.grid[0].filter((n) => n !== 0);
			const bottomZeros = ticket.grid[2].filter((n) => n !== 0);

			if (topZeros.length < 5 || bottomZeros.length < 5) return false;
			const corners = [
				topZeros[0],
				topZeros[4],
				bottomZeros[0],
				bottomZeros[4],
			];
			return corners.every((n) => calledSet.has(n));
		},
	},
	{
		id: "HINDUSTAN",
		name: "Hindustan (1-49)",
		description: "All numbers from 1 to 49 on the ticket are marked",
		defaultEnabled: false,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			const targetNumbers = [];
			for (const row of ticket.grid) {
				for (const num of row) {
					if (num !== 0 && num <= 49) {
						targetNumbers.push(num);
					}
				}
			}
			return (
				targetNumbers.length > 0 &&
				targetNumbers.every((n) => calledSet.has(n))
			);
		},
	},
	{
		id: "PAKISTAN",
		name: "Pakistan (50-90)",
		description: "All numbers from 50 to 90 on the ticket are marked",
		defaultEnabled: false,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			const targetNumbers = [];
			for (const row of ticket.grid) {
				for (const num of row) {
					if (num !== 0 && num >= 50 && num <= 90) {
						targetNumbers.push(num);
					}
				}
			}
			return (
				targetNumbers.length > 0 &&
				targetNumbers.every((n) => calledSet.has(n))
			);
		},
	},
	{
		id: "STAR",
		name: "Star",
		description:
			"4 corners plus the center number (3rd number of middle row)",
		defaultEnabled: false,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			const topZeros = ticket.grid[0].filter((n) => n !== 0);
			const midZeros = ticket.grid[1].filter((n) => n !== 0);
			const bottomZeros = ticket.grid[2].filter((n) => n !== 0);

			if (
				topZeros.length < 5 ||
				midZeros.length < 5 ||
				bottomZeros.length < 5
			)
				return false;
			const starNumbers = [
				topZeros[0],
				topZeros[4],
				midZeros[2],
				bottomZeros[0],
				bottomZeros[4],
			];
			return starNumbers.every((n) => calledSet.has(n));
		},
	},
	{
		id: "ANY_ROW",
		name: "Any Row",
		description: "Any 1 complete row marked on the ticket",
		defaultEnabled: true,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			for (const row of ticket.grid) {
				const nonZeros = row.filter((n) => n !== 0);
				if (
					nonZeros.length > 0 &&
					nonZeros.every((n) => calledSet.has(n))
				) {
					return true;
				}
			}
			return false;
		},
	},
	{
		id: "HALF_HOUSE",
		name: "Half House / Housie 1",
		description: "Any 2 complete rows marked on the ticket",
		defaultEnabled: false,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			let completedRows = 0;
			for (const row of ticket.grid) {
				const nonZeros = row.filter((n) => n !== 0);
				if (
					nonZeros.length > 0 &&
					nonZeros.every((n) => calledSet.has(n))
				) {
					completedRows++;
				}
			}
			return completedRows >= 2;
		},
	},
	{
		id: "FULL_HOUSE",
		name: "Full House / Housie",
		description: "All 15 numbers marked on the ticket",
		defaultEnabled: true,
		checkFn: (ticket, calledNumbers) => {
			const calledSet = new Set(calledNumbers);
			for (const row of ticket.grid) {
				for (const num of row) {
					if (num !== 0 && !calledSet.has(num)) {
						return false;
					}
				}
			}
			return true;
		},
	},
];
