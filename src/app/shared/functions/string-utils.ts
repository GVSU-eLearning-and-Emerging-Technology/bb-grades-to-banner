export function trimQuotes(text: string): string {
	return text.replace(/^['"]*([^'"]*)['"]*$/, "$1");
}
