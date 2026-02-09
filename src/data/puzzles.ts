import type { PuzzleDefinition } from '@/state/schemas/puzzle-schema';

/**
 * Piece colors - Funky neon-inspired palette
 */
export const PIECE_COLORS = {
	red: '#ef4444',
	orange: '#f97316',
	yellow: '#facc15',
	green: '#22c55e',
	blue: '#3b82f6',
	purple: '#a855f7',
	pink: '#ec4899',
	cyan: '#06b6d4'
} as const;

/**
 * Easy puzzles - 3 pieces, smaller boards
 */
const easyPuzzles: PuzzleDefinition[] = [
	{
		id: 'easy-1',
		difficulty: 'easy',
		boardShape: [
			[true, true, true],
			[true, true, true],
			[true, false, false]
		],
		pieces: [
			{
				id: 'e1-p1',
				shape: [
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'e1-p2',
				shape: [
					[true, true],
					[false, true]
				],
				color: PIECE_COLORS.blue
			},
			{
				id: 'e1-p3',
				shape: [[true]],
				color: PIECE_COLORS.yellow
			}
		]
	},
	{
		id: 'easy-2',
		difficulty: 'easy',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true]
		],
		pieces: [
			{
				id: 'e2-p1',
				shape: [[true, true, true]],
				color: PIECE_COLORS.green
			},
			{
				id: 'e2-p2',
				shape: [
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'e2-p3',
				shape: [[true], [true]],
				color: PIECE_COLORS.orange
			}
		]
	},
	{
		id: 'easy-3',
		difficulty: 'easy',
		boardShape: [
			[false, true, true],
			[true, true, true],
			[true, true, false]
		],
		pieces: [
			{
				id: 'e3-p1',
				shape: [
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.orange
			},
			{
				id: 'e3-p2',
				shape: [
					[true, true],
					[false, true]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'e3-p3',
				shape: [[true]],
				color: PIECE_COLORS.pink
			}
		]
	},
	{
		id: 'easy-4',
		difficulty: 'easy',
		boardShape: [
			[true, true, true],
			[true, true, true],
			[false, true, true]
		],
		pieces: [
			{
				id: 'e4-p1',
				shape: [[true], [true], [true]],
				color: PIECE_COLORS.blue
			},
			{
				id: 'e4-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'e4-p3',
				shape: [[true]],
				color: PIECE_COLORS.yellow
			}
		]
	},
	{
		id: 'easy-5',
		difficulty: 'easy',
		boardShape: [
			[true, true, true],
			[true, true, true],
			[true, false, false]
		],
		pieces: [
			{
				id: 'e5-p1',
				shape: [
					[true, true],
					[false, true]
				],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'e5-p2',
				shape: [
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.green
			},
			{
				id: 'e5-p3',
				shape: [[true]],
				color: PIECE_COLORS.purple
			}
		]
	},
	{
		id: 'easy-6',
		difficulty: 'easy',
		boardShape: [
			[true, true, true, true],
			[true, true, true, false]
		],
		pieces: [
			{
				id: 'e6-p1',
				shape: [
					[true, true, true],
					[false, true, false]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'e6-p2',
				shape: [[true, true]],
				color: PIECE_COLORS.orange
			},
			{
				id: 'e6-p3',
				shape: [[true]],
				color: PIECE_COLORS.pink
			}
		]
	},
	{
		id: 'easy-7',
		difficulty: 'easy',
		boardShape: [
			[true, true, true],
			[true, true, true],
			[false, false, true]
		],
		pieces: [
			{
				id: 'e7-p1',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.green
			},
			{
				id: 'e7-p2',
				shape: [[true, true, true]],
				color: PIECE_COLORS.purple
			}
		]
	},
	{
		id: 'easy-8',
		difficulty: 'easy',
		boardShape: [
			[false, true, true],
			[true, true, true],
			[true, true, true]
		],
		pieces: [
			{
				id: 'e8-p1',
				shape: [
					[false, true, true],
					[true, true, false]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'e8-p2',
				shape: [[true], [true], [true]],
				color: PIECE_COLORS.blue
			},
			{
				id: 'e8-p3',
				shape: [[true]],
				color: PIECE_COLORS.yellow
			}
		]
	},
	{
		id: 'easy-9',
		difficulty: 'easy',
		boardShape: [
			[true, true, true],
			[true, true, false],
			[true, true, false]
		],
		pieces: [
			{
				id: 'e9-p1',
				shape: [
					[true, false],
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.orange
			},
			{
				id: 'e9-p2',
				shape: [[true, true]],
				color: PIECE_COLORS.cyan
			}
		]
	},
	{
		id: 'easy-10',
		difficulty: 'easy',
		boardShape: [
			[true, true, true, true],
			[false, true, true, true]
		],
		pieces: [
			{
				id: 'e10-p1',
				shape: [[true, true, true, true]],
				color: PIECE_COLORS.pink
			},
			{
				id: 'e10-p2',
				shape: [[true, true, true]],
				color: PIECE_COLORS.green
			}
		]
	}
];

/**
 * Medium puzzles - 4 pieces, medium boards
 */
const mediumPuzzles: PuzzleDefinition[] = [
	{
		id: 'medium-1',
		difficulty: 'medium',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true]
		],
		pieces: [
			{
				id: 'm1-p1',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'm1-p2',
				shape: [[true, true, true]],
				color: PIECE_COLORS.blue
			},
			{
				id: 'm1-p3',
				shape: [
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.green
			},
			{
				id: 'm1-p4',
				shape: [[true], [true]],
				color: PIECE_COLORS.yellow
			}
		]
	},
	{
		id: 'medium-2',
		difficulty: 'medium',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true]
		],
		pieces: [
			{
				id: 'm2-p1',
				shape: [
					[true, true],
					[true, false],
					[true, false]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'm2-p2',
				shape: [
					[true, true],
					[false, true]
				],
				color: PIECE_COLORS.orange
			},
			{
				id: 'm2-p3',
				shape: [[true, true]],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'm2-p4',
				shape: [[true], [true], [true]],
				color: PIECE_COLORS.pink
			}
		]
	},
	{
		id: 'medium-3',
		difficulty: 'medium',
		boardShape: [
			[true, true, true],
			[true, true, true],
			[true, true, true],
			[false, true, true]
		],
		pieces: [
			{
				id: 'm3-p1',
				shape: [
					[true, false],
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'm3-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.blue
			},
			{
				id: 'm3-p3',
				shape: [[true], [true]],
				color: PIECE_COLORS.green
			},
			{
				id: 'm3-p4',
				shape: [[true]],
				color: PIECE_COLORS.yellow
			}
		]
	},
	{
		id: 'medium-4',
		difficulty: 'medium',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true]
		],
		pieces: [
			{
				id: 'm4-p1',
				shape: [[true, true, true, true]],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'm4-p2',
				shape: [
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'm4-p3',
				shape: [
					[true, true],
					[false, true]
				],
				color: PIECE_COLORS.orange
			},
			{
				id: 'm4-p4',
				shape: [[true], [true]],
				color: PIECE_COLORS.cyan
			}
		]
	},
	{
		id: 'medium-5',
		difficulty: 'medium',
		boardShape: [
			[false, true, true],
			[true, true, true],
			[true, true, true],
			[true, true, true]
		],
		pieces: [
			{
				id: 'm5-p1',
				shape: [
					[true, false],
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'm5-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.pink
			},
			{
				id: 'm5-p3',
				shape: [[true], [true]],
				color: PIECE_COLORS.red
			},
			{
				id: 'm5-p4',
				shape: [[true]],
				color: PIECE_COLORS.blue
			}
		]
	},
	{
		id: 'medium-6',
		difficulty: 'medium',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[false, true, true, false]
		],
		pieces: [
			{
				id: 'm6-p1',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'm6-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.orange
			},
			{
				id: 'm6-p3',
				shape: [[true, true]],
				color: PIECE_COLORS.cyan
			}
		]
	},
	{
		id: 'medium-7',
		difficulty: 'medium',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true]
		],
		pieces: [
			{
				id: 'm7-p1',
				shape: [[true], [true], [true]],
				color: PIECE_COLORS.green
			},
			{
				id: 'm7-p2',
				shape: [
					[true, true],
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.pink
			},
			{
				id: 'm7-p3',
				shape: [[true], [true], [true]],
				color: PIECE_COLORS.red
			}
		]
	},
	{
		id: 'medium-8',
		difficulty: 'medium',
		boardShape: [
			[true, true, true],
			[true, true, true],
			[true, true, true],
			[true, true, false]
		],
		pieces: [
			{
				id: 'm8-p1',
				shape: [
					[false, true, false],
					[true, true, true]
				],
				color: PIECE_COLORS.blue
			},
			{
				id: 'm8-p2',
				shape: [
					[true, true],
					[false, true],
					[false, true]
				],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'm8-p3',
				shape: [[true, true]],
				color: PIECE_COLORS.purple
			},
			{
				id: 'm8-p4',
				shape: [[true]],
				color: PIECE_COLORS.orange
			}
		]
	},
	{
		id: 'medium-9',
		difficulty: 'medium',
		boardShape: [
			[true, true, true, true, true],
			[true, true, true, true, true]
		],
		pieces: [
			{
				id: 'm9-p1',
				shape: [
					[true, false],
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'm9-p2',
				shape: [[true, true, true]],
				color: PIECE_COLORS.pink
			},
			{
				id: 'm9-p3',
				shape: [[true, true]],
				color: PIECE_COLORS.green
			},
			{
				id: 'm9-p4',
				shape: [[true]],
				color: PIECE_COLORS.red
			}
		]
	},
	{
		id: 'medium-10',
		difficulty: 'medium',
		boardShape: [
			[false, true, true],
			[true, true, true],
			[true, true, true],
			[true, true, false]
		],
		pieces: [
			{
				id: 'm10-p1',
				shape: [
					[true, true],
					[true, false],
					[true, false]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'm10-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.blue
			},
			{
				id: 'm10-p3',
				shape: [[true], [true]],
				color: PIECE_COLORS.yellow
			}
		]
	}
];

/**
 * Hard puzzles - 5 pieces, larger boards
 */
const hardPuzzles: PuzzleDefinition[] = [
	{
		id: 'hard-1',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true, true],
			[true, true, true, true, true],
			[true, true, true, true, true]
		],
		pieces: [
			{
				id: 'h1-p1',
				shape: [
					[true, true],
					[true, false],
					[true, false]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'h1-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.blue
			},
			{
				id: 'h1-p3',
				shape: [[true, true, true]],
				color: PIECE_COLORS.green
			},
			{
				id: 'h1-p4',
				shape: [
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'h1-p5',
				shape: [[true]],
				color: PIECE_COLORS.purple
			}
		]
	},
	{
		id: 'hard-2',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true, true],
			[true, true, true, true, true],
			[true, true, true, true, false],
			[true, true, true, false, false]
		],
		pieces: [
			{
				id: 'h2-p1',
				shape: [[true, true, true, true]],
				color: PIECE_COLORS.orange
			},
			{
				id: 'h2-p2',
				shape: [
					[true, true],
					[true, false],
					[true, false]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'h2-p3',
				shape: [
					[true, true],
					[false, true],
					[false, true]
				],
				color: PIECE_COLORS.pink
			},
			{
				id: 'h2-p4',
				shape: [
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'h2-p5',
				shape: [[true], [true]],
				color: PIECE_COLORS.blue
			}
		]
	},
	{
		id: 'hard-3',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true]
		],
		pieces: [
			{
				id: 'h3-p1',
				shape: [
					[true, false],
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.green
			},
			{
				id: 'h3-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'h3-p3',
				shape: [
					[true, true, true],
					[false, true, false]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'h3-p4',
				shape: [[true], [true], [true]],
				color: PIECE_COLORS.orange
			},
			{
				id: 'h3-p5',
				shape: [[true]],
				color: PIECE_COLORS.cyan
			}
		]
	},
	{
		id: 'hard-4',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true, true],
			[true, true, true, true, true],
			[true, true, true, true, true],
			[true, true, true, false, false]
		],
		pieces: [
			{
				id: 'h4-p1',
				shape: [
					[true, true, true],
					[true, false, false]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'h4-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.pink
			},
			{
				id: 'h4-p3',
				shape: [
					[false, true],
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'h4-p4',
				shape: [[true, true, true, true]],
				color: PIECE_COLORS.blue
			},
			{
				id: 'h4-p5',
				shape: [[true], [true]],
				color: PIECE_COLORS.green
			}
		]
	},
	{
		id: 'hard-5',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true],
			[false, false, true, false]
		],
		pieces: [
			{
				id: 'h5-p1',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'h5-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'h5-p3',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.orange
			},
			{
				id: 'h5-p4',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'h5-p5',
				shape: [[true]],
				color: PIECE_COLORS.red
			}
		]
	},
	{
		id: 'hard-6',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true, true],
			[true, true, true, true, true],
			[true, true, true, true, true]
		],
		pieces: [
			{
				id: 'h6-p1',
				shape: [
					[true, true],
					[true, false],
					[true, false]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'h6-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.orange
			},
			{
				id: 'h6-p3',
				shape: [[true, true, true]],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'h6-p4',
				shape: [
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.pink
			},
			{
				id: 'h6-p5',
				shape: [[true]],
				color: PIECE_COLORS.green
			}
		]
	},
	{
		id: 'hard-7',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true]
		],
		pieces: [
			{
				id: 'h7-p1',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'h7-p2',
				shape: [
					[true, true],
					[false, true],
					[false, true]
				],
				color: PIECE_COLORS.blue
			},
			{
				id: 'h7-p3',
				shape: [[true, true, true, true]],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'h7-p4',
				shape: [
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'h7-p5',
				shape: [[true]],
				color: PIECE_COLORS.orange
			}
		]
	},
	{
		id: 'hard-8',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true, true],
			[true, true, true, true, true],
			[false, true, true, true, false]
		],
		pieces: [
			{
				id: 'h8-p1',
				shape: [
					[true, true],
					[true, false]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'h8-p2',
				shape: [
					[true, true],
					[false, true]
				],
				color: PIECE_COLORS.pink
			},
			{
				id: 'h8-p3',
				shape: [[true, true, true]],
				color: PIECE_COLORS.green
			},
			{
				id: 'h8-p4',
				shape: [
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.red
			},
			{
				id: 'h8-p5',
				shape: [[true]],
				color: PIECE_COLORS.blue
			}
		]
	},
	{
		id: 'hard-9',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, true],
			[true, true, true, false]
		],
		pieces: [
			{
				id: 'h9-p1',
				shape: [
					[true, true, true],
					[false, true, false]
				],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'h9-p2',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.purple
			},
			{
				id: 'h9-p3',
				shape: [[true, true, true]],
				color: PIECE_COLORS.orange
			},
			{
				id: 'h9-p4',
				shape: [
					[true, false],
					[true, true]
				],
				color: PIECE_COLORS.cyan
			},
			{
				id: 'h9-p5',
				shape: [[true]],
				color: PIECE_COLORS.pink
			}
		]
	},
	{
		id: 'hard-10',
		difficulty: 'hard',
		boardShape: [
			[true, true, true, true, true],
			[true, true, true, true, true],
			[true, true, true, true, true],
			[false, false, true, false, false]
		],
		pieces: [
			{
				id: 'h10-p1',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.green
			},
			{
				id: 'h10-p2',
				shape: [[true, true, true]],
				color: PIECE_COLORS.red
			},
			{
				id: 'h10-p3',
				shape: [[true], [true], [true]],
				color: PIECE_COLORS.blue
			},
			{
				id: 'h10-p4',
				shape: [
					[true, true],
					[true, true]
				],
				color: PIECE_COLORS.yellow
			},
			{
				id: 'h10-p5',
				shape: [[true, true]],
				color: PIECE_COLORS.pink
			}
		]
	}
];

/**
 * All puzzles organized by difficulty
 */
export const PUZZLES: Record<string, PuzzleDefinition[]> = {
	easy: easyPuzzles,
	medium: mediumPuzzles,
	hard: hardPuzzles
};

/**
 * All puzzles indexed by ID for quick lookup
 */
export const PUZZLES_BY_ID: Record<string, PuzzleDefinition> = {
	...Object.fromEntries(easyPuzzles.map((p) => [p.id, p])),
	...Object.fromEntries(mediumPuzzles.map((p) => [p.id, p])),
	...Object.fromEntries(hardPuzzles.map((p) => [p.id, p]))
};

/**
 * Get a random puzzle for given difficulties
 */
export function getRandomPuzzleId(
	difficulties: ('easy' | 'medium' | 'hard')[],
	excludeIds: string[] = []
): string {
	// Combine all puzzles from selected difficulties
	const allPuzzles = difficulties.flatMap((diff) => PUZZLES[diff]);
	const available = allPuzzles.filter((p) => !excludeIds.includes(p.id));

	if (available.length === 0) {
		// If all puzzles have been used, reset and pick any
		return allPuzzles[Math.floor(Math.random() * allPuzzles.length)].id;
	}
	return available[Math.floor(Math.random() * available.length)].id;
}

/**
 * Get N random puzzle IDs for a game session from selected difficulties
 */
export function getRandomPuzzleIds(
	difficulties: ('easy' | 'medium' | 'hard')[],
	count: number
): string[] {
	const ids: string[] = [];
	for (let i = 0; i < count; i++) {
		ids.push(getRandomPuzzleId(difficulties, ids));
	}
	return ids;
}
