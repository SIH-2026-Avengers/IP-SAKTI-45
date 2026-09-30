def build_context(
    documents
):

    context_parts = []

    for index, document in enumerate(
        documents,
        start=1
    ):

        source = (
            document.source_file
            or "Unknown source"
        )

        page = (
            document.page_start
            if document.page_start is not None
            else "Unknown"
        )

        section = (
            document.section
            if document.section
            else "Not identified"
        )

        context_parts.append(

            f"""
SOURCE {index}

Document: {document.document_title}
File: {source}
Page: {page}
Section: {section}

Content:
{document.content}
""".strip()
        )

    return "\n\n".join(
        context_parts
    )