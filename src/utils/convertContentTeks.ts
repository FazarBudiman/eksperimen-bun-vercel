type EditorJSBlock = {
  type: string
  data: Record<string, any>
}

function stripHtml(text: unknown): string {
  if (typeof text !== 'string') return ''
  return text.replace(/<[^>]*>/g, '')
}

export async function generateContentText(
  blocks: EditorJSBlock[]
): Promise<string> {
  const texts: string[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'header':
      case 'paragraph':
        if (typeof block.data?.text === 'string') {
          texts.push(stripHtml(block.data.text))
        }
        break

      case 'list':
        if (Array.isArray(block.data?.items)) {
          block.data.items.forEach((item: unknown) => {
            if (typeof item === 'string') {
              texts.push(stripHtml(item))
            }
          })
        }
        break

      case 'quote':
        if (typeof block.data?.text === 'string') {
          texts.push(stripHtml(block.data.text))
        }
        break
    }
  }

  return texts.join(' ').replace(/\s+/g, ' ').trim()
}
