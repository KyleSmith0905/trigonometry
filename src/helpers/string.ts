const trimTemplateLiterals = (templateLiteral: string) => {
  return templateLiteral.split("\n")
  .map(s => s.trim())
  // Remove empty lines by filtering them out
  .filter(Boolean)
  .join("\n")
}

export { trimTemplateLiterals };