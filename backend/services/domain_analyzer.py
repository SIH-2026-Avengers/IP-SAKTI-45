from typing import List, Dict, Any


def determine_relevant_domains(
    predicted_category: str,
    top_predictions: List[Dict[str, Any]],
    features: Dict[str, Any],
    jurisdiction: str = "India"
) -> List[Dict[str, Any]]:
    """
    Determines relevant IP & Regulatory domains dynamically based on
    classifier predictions, feature attributes, and statutory frameworks.
    """
    domains = []
    seen = set()

    def add_domain(name: str, category: str, label: str, reason: str):
        if name not in seen:
            seen.add(name)
            domains.append({
                "domain": name,
                "category": category,
                "label": label,
                "reason": reason,
                "source_ids": []
            })

    # 1. Primary Classification Domain
    top_cat = predicted_category
    if top_cat == "Patent":
        add_domain(
            "Patent Law & Traditional Knowledge",
            "Patent",
            "IP",
            "Evaluated under Patents Act 1970. Key considerations include Section 3(p) TKDL scrutiny and patentability of modified formulations or extraction processes."
        )
    elif top_cat == "Drug Regulation":
        add_domain(
            "Ayush Drug Regulation",
            "Drug Regulation",
            "Regulatory",
            "Governed under Drugs & Cosmetics Act 1940 and Rules 1945 (Chapter IV-A, First Schedule authoritative compendia licensing pathways)."
        )
    elif top_cat == "Ayurveda-Aahar":
        add_domain(
            "Ayurveda-Aahar Regulations",
            "Ayurveda-Aahar",
            "Regulatory",
            "Subject to FSSAI Ayurveda-Aahar Regulations 2022 covering non-medicinal dietary food preparations without disease treatment claims."
        )
    elif top_cat == "Biological Diversity":
        add_domain(
            "Biological Diversity Compliance",
            "Biological Diversity",
            "Compliance",
            "Requires compliance under Biological Diversity Act 2002, including Section 6 prior approval from the National Biodiversity Authority (NBA)."
        )
    elif top_cat == "Trademark":
        add_domain(
            "Trademark & Brand Protection",
            "Trademark",
            "IP",
            "Governed by Trade Marks Act 1999 to secure brand identifiers, product nomenclature, and distinctive herbal commercial marks."
        )
    elif top_cat == "Geographical Indication":
        add_domain(
            "Geographical Indications",
            "Geographical Indication",
            "IP",
            "Governed by Geographical Indications of Goods Act 1999 for region-specific herbs, cultivars, or indigenous Ayurvedic origins."
        )
    elif top_cat == "Design":
        add_domain(
            "Industrial Design Protection",
            "Design",
            "IP",
            "Governed by Designs Act 2000 for novel aesthetic packaging, dispensers, or proprietary applicator shapes."
        )
    elif top_cat == "Trade Secret":
        add_domain(
            "Trade Secret & Confidentiality",
            "Trade Secret",
            "IP",
            "Protects non-disclosed formulation ratios, proprietary standard operating procedures (SOPs), and operational know-how under common law."
        )
    elif top_cat == "Copyright":
        add_domain(
            "Copyright & Creative Expression",
            "Copyright",
            "IP",
            "Protects original literary packaging text, informational leaflets, artistic brand illustrations, and digital product assets under Copyright Act 1957."
        )
    elif top_cat == "Plant Variety Protection":
        add_domain(
            "Plant Variety & Farmers Rights",
            "Plant Variety Protection",
            "IP",
            "Governed by PPV&FR Act 2001 for distinct, uniform, and stable medicinal plant varieties and breeder rights."
        )
    elif top_cat == "Food Regulation":
        add_domain(
            "Food Safety & Standards (FSSAI)",
            "Food Regulation",
            "Regulatory",
            "Governed by Food Safety and Standards Act 2006 for nutraceuticals, health supplements, and food products."
        )
    else:
        add_domain(
            "General Ayush Regulatory",
            "Regulatory",
            "Regulatory",
            "Applies general statutory compliance frameworks applicable to Ayurvedic herbal formulations."
        )

    # 2. Secondary High-Probability Categories (Top 2-3 with > 5% probability)
    for pred in top_predictions[1:4]:
        cat = pred.get("category")
        prob = pred.get("probability", 0)
        if prob > 0.05 and cat not in seen:
            if cat == "Biological Diversity":
                add_domain(
                    "Biological Diversity & ABS",
                    "Biological Diversity",
                    "Compliance",
                    "Significant statutory nexus with Indian biological resources and Access & Benefit Sharing (ABS) mandates under BDA 2002."
                )
            elif cat == "Ayurveda-Aahar":
                add_domain(
                    "Ayurveda-Aahar Interface",
                    "Ayurveda-Aahar",
                    "Regulatory",
                    "Potential dual classification overlap between dietary wellness foods (FSSAI) and therapeutic medicinal formulations."
                )
            elif cat == "Patent":
                add_domain(
                    "Process Patent Feasibility",
                    "Patent",
                    "IP",
                    "Potential scope for novel extraction or technical delivery mechanisms under Patents Act 1970."
                )
            elif cat == "Drug Regulation":
                add_domain(
                    "Classical vs. Proprietary Licensing",
                    "Drug Regulation",
                    "Regulatory",
                    "Licensing considerations under Rule 158-B of Drugs and Cosmetics Rules for AYUSH formulations."
                )
            elif cat == "Trademark":
                add_domain(
                    "Brand Name Clearance",
                    "Trademark",
                    "IP",
                    "Ensuring brand nomenclature does not conflict with generic Ayurvedic Sanskrit terms (Section 9/11 TM Act)."
                )

    # 3. Attribute-Driven Domain Triggers
    bio_matter = features.get("bio_or_plant_matter")
    if bio_matter in ["Biological Resource", "Plant Variety", "Traditional Knowledge"]:
        add_domain(
            "National Biodiversity Authority (NBA)",
            "Biological Diversity",
            "Compliance",
            f"Involvement of {bio_matter} triggers Section 3/4/6 scrutiny under Biological Diversity Act 2002 prior to IPR filing or commercial utilization."
        )

    if features.get("technical_invention") == "Yes":
        add_domain(
            "Patent Prior Art (TKDL) Clearance",
            "Patent",
            "IP",
            "Novel technical claims require vetting against Traditional Knowledge Digital Library (TKDL) and Section 3(p) statutory patent bars."
        )

    if features.get("confidentiality") == "Yes":
        add_domain(
            "Confidentiality & Know-How Agreements",
            "Trade Secret",
            "IP",
            "Non-disclosure agreements (NDAs) and trade secret protections for proprietary extraction methods or dosage ratios."
        )

    if features.get("brand_identifier") == "Yes":
        add_domain(
            "Ayurvedic Brand & TM Clearance",
            "Trademark",
            "IP",
            "Distinctiveness vetting under Trade Marks Act 1999 to protect proprietary trade dress and herbal brand identity."
        )

    return domains[:6]
