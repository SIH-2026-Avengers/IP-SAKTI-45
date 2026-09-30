import re


def extract_page_number(text):

    """
    Detect page markers such as:

    --- PAGE 21 ---
    """

    match = re.search(
        r"---\s*PAGE\s+(\d+)\s*---",
        text,
        re.IGNORECASE
    )

    if match:
        return int(match.group(1))

    return None


def find_section(text):

    """
    Try to identify the legal section
    associated with a chunk.
    """

    lines = text.splitlines()

    current_section = None

    for line in lines:

        line = line.strip()

        if not line:
            continue

        # Common Indian legal pattern:
        # 3. Definitions
        match = re.match(
            r"^(\d+[A-Za-z]?)\.\s+(.+)$",
            line
        )

        if match:

            current_section = (
                f"Section {match.group(1)}"
            )

        # Explicit Section pattern
        match = re.match(
            r"^Section\s+(\d+[A-Za-z]?)",
            line,
            re.IGNORECASE
        )

        if match:

            current_section = (
                f"Section {match.group(1)}"
            )

    return current_section