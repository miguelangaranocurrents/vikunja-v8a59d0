import type {Fragment, Node} from '@tiptap/pm/model'

const LIST_TYPES = ['bulletList', 'orderedList', 'taskList']

function indent(depth: number): string {
	return '  '.repeat(depth)
}

function listLines(list: Node, depth: number): string[] {
	const lines: string[] = []
	let index = 1
	list.forEach(item => {
		const marker = list.type.name === 'orderedList' ? `${index++}. ` : '- '
		const [first = '', ...rest] = blockLines(item, depth + 1)
		lines.push(indent(depth) + marker + first.trimStart(), ...rest)
	})
	return lines
}

// Turns block content into one line per textblock, keeping list markers and nesting
// so that a copied list still reads as a list when pasted as plain text.
function blockLines(container: Node | Fragment, depth: number): string[] {
	const lines: string[] = []
	container.forEach(node => {
		if (LIST_TYPES.includes(node.type.name)) {
			lines.push(...listLines(node, depth))
		} else if (node.isTextblock) {
			lines.push(indent(depth) + node.textContent)
		} else {
			lines.push(...blockLines(node, depth))
		}
	})
	return lines
}

export function sliceToPlainText(content: Fragment): string {
	return blockLines(content, 0).join('\n')
}
