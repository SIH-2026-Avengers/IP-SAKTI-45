def build_metadata_filter(
    jurisdiction: str,
    category: str
):
    """
    Build the Chroma metadata filter.

    Both conditions MUST match.
    """

    if not jurisdiction:
        raise ValueError(
            "Jurisdiction is required."
        )

    if not category:
        raise ValueError(
            "Category is required."
        )

    return {
        "$and": [
            {
                "jurisdiction": jurisdiction
            },
            {
                "category": category
            }
        ]
    }