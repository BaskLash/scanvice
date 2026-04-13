"use client"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const lines = text.trim().split('\n')
    const elements: JSX.Element[] = []
    let currentParagraph: string[] = []
    let inList = false
    let listItems: string[] = []
    let key = 0

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ').trim()
        if (text) {
          elements.push(
            <p key={key++} className="mb-6 text-muted-foreground leading-relaxed">
              {renderInlineFormatting(text)}
            </p>
          )
        }
        currentParagraph = []
      }
    }

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key++} className="mb-6 space-y-2 pl-6">
            {listItems.map((item, i) => (
              <li key={i} className="text-muted-foreground leading-relaxed list-disc">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ul>
        )
        listItems = []
        inList = false
      }
    }

    const renderInlineFormatting = (text: string) => {
      // Handle bold text
      const parts = text.split(/(\*\*[^*]+\*\*)/g)
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        }
        // Handle links
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
        const linkParts = part.split(linkRegex)
        if (linkParts.length > 1) {
          const result: (string | JSX.Element)[] = []
          for (let j = 0; j < linkParts.length; j += 3) {
            if (linkParts[j]) result.push(linkParts[j])
            if (linkParts[j + 1] && linkParts[j + 2]) {
              result.push(
                <a 
                  key={`link-${j}`} 
                  href={linkParts[j + 2]} 
                  className="text-primary hover:underline"
                >
                  {linkParts[j + 1]}
                </a>
              )
            }
          }
          return <span key={i}>{result}</span>
        }
        return part
      })
    }

    for (const line of lines) {
      const trimmedLine = line.trim()

      // Horizontal rule
      if (trimmedLine === '---') {
        flushParagraph()
        flushList()
        elements.push(<hr key={key++} className="my-8 border-border" />)
        continue
      }

      // H1
      if (trimmedLine.startsWith('# ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h1 key={key++} className="mb-6 font-sans text-3xl font-bold text-foreground">
            {trimmedLine.slice(2)}
          </h1>
        )
        continue
      }

      // H2
      if (trimmedLine.startsWith('## ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h2 key={key++} className="mb-4 mt-10 font-sans text-2xl font-semibold text-foreground">
            {trimmedLine.slice(3)}
          </h2>
        )
        continue
      }

      // H3
      if (trimmedLine.startsWith('### ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h3 key={key++} className="mb-3 mt-8 font-sans text-xl font-semibold text-foreground">
            {trimmedLine.slice(4)}
          </h3>
        )
        continue
      }

      // List item
      if (trimmedLine.startsWith('- ')) {
        flushParagraph()
        inList = true
        listItems.push(trimmedLine.slice(2))
        continue
      }

      // Empty line
      if (trimmedLine === '') {
        if (inList) {
          flushList()
        }
        flushParagraph()
        continue
      }

      // Regular text
      if (inList) {
        flushList()
      }
      currentParagraph.push(trimmedLine)
    }

    flushParagraph()
    flushList()

    return elements
  }

  return (
    <div className="prose-custom">
      {renderContent(content)}
    </div>
  )
}
