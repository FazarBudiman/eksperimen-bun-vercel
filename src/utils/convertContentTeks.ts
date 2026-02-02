type EditorJSBlock = {
  type: string
  data: Record<string, any>
}

function stripHtml(text: string): string {
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
        if (block.data?.text) {
          texts.push(stripHtml(block.data.text))
        }
        break

      case 'list':
        if (Array.isArray(block.data?.items)) {
          block.data.items.forEach((item: string) => {
            texts.push(stripHtml(item))
          })
        }
        break

      case 'quote':
        if (block.data?.text) {
          texts.push(stripHtml(block.data.text))
        }
        break

      // code, image, embed → intentionally ignored
    }
  }

  return texts.join(' ').replace(/\s+/g, ' ').trim()
}
