import re


SECTION_PATTERNS = [

    # Indian legal documents
    re.compile(
        r"^\s*(\d+[A-Za-z]?)\.\s+"
        r"(.+)$"
    ),

    # Section 3A / 3(a)
    re.compile(
        r"^\s*Section\s+"
        r"(\d+[A-Za-z]?)"
        r"(?:\s*[\.\-:]\s*)?"
        r"(.*)$",
        re.IGNORECASE
    ),

    # Rules
    re.compile(
        r"^\s*Rule\s+"
        r"(\d+[A-Za-z]?)"
        r"(?:\s*[\.\-:]\s*)?"
        r"(.*)$",
        re.IGNORECASE
    ),

    # Articles
    re.compile(
        r"^\s*Article\s+"
        r"(\d+[A-Za-z]?)"
        r"(?:\s*[\.\-:]\s*)?"
        r"(.*)$",
        re.IGNORECASE
    ),
]


def detect_section(line):

    line = line.strip()

    if not line:
        return None

    for pattern in SECTION_PATTERNS:

        match = pattern.match(line)

        if match:

            number = match.group(1)

            title = (
                match.group(2).strip()
                if match.lastindex >= 2
                else ""
            )

            return {
                "number": number,
                "title": title
            }

    return None