function createMarkdownLink(
  link: string,
  linkName: string | null | undefined,
): string {
  if (linkName) {
    return `[${linkName}](${link})`;
  }
  return `<${link}>`;
}

function createMarkdownImage(imageUri: string): string {
  return `![image](${imageUri})`;
}

function markdownBold(content: string): string {
  return `**${content}**`;
}

function markdownItalic(content: string): string {
  return `*${content}*`;
}

function heading(content: string, headingLevel: number): string | null {
  if (headingLevel < 6) {
    const headingContent = [];
    for (let i = 0; i < headingLevel; i += 1) {
      headingContent.push('#');
    }
    headingContent.push(` ${content}`);
    return headingContent.join('');
  }
  return null;
}

export default {
  createMarkdownLink,
  createMarkdownImage,
  markdownBold,
  markdownItalic,
  heading,
};
