def contextualize_chunk(
    chunk: str,
    document_title: str,
    section: str | None = None,
    page_number: int | None = None,
) -> str:
    """
    Add deterministic document context to a chunk.
    """

    context_parts = [
        f"Document: {document_title}"
    ]

    if section:
        context_parts.append(
            f"Section: {section}"
        )

    if page_number:
        context_parts.append(
            f"Page: {page_number}"
        )

    context = "\n".join(context_parts)

    return f"{context}\n\n{chunk}"