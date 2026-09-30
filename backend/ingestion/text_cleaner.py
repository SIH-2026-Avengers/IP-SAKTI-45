import re


def normalize_unicode(text: str) -> str:
    """
    Normalize common Unicode inconsistencies.
    """

    replacements = {
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2013": "-",
        "\u2014": "-",
        "\xa0": " ",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    return text


def remove_excessive_whitespace(text: str) -> str:
    """
    Reduce unnecessary spaces and blank lines.
    """

    text = re.sub(r"[ \t]+", " ", text)

    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)

    return text


def fix_line_breaks(text: str) -> str:
    """
    Join lines that were broken by PDF formatting.
    """

    text = re.sub(
        r"(?<![.!?:;])\n(?=[a-z])",
        " ",
        text,
    )

    return text


def clean_text(text: str) -> str:
    """
    Run the complete cleaning pipeline.
    """

    text = normalize_unicode(text)

    text = fix_line_breaks(text)

    text = remove_excessive_whitespace(text)

    return text.strip()