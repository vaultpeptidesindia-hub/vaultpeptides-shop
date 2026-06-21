import Navbar from "@/components/layout/navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import type { Metadata } from "next";

const ARTICLES: Record<
  string,
  {
    title: string;
    sub: string;
    desc: string;
    intro: string;
    sections: { heading: string; body: string }[];
    disclaimer: string;
  }
> = {
  retatrutide: {
    title: "What is Retatrutide?",
    sub: "GIP / GLP-1 / Glucagon Tri-Agonist",
    desc: "A triple-receptor agonist peptide supplied as an analytical reference standard for in-vitro laboratory research.",
    intro:
      "Retatrutide (LY3437943) is a synthetic peptide classified as a GIP / GLP-1 / glucagon triple-receptor agonist. Vault Peptides supplies it solely as an analytical-grade biochemical reference standard for in-vitro laboratory research, assay development, and analytical method validation. It is not a drug, supplement, or consumer product.",
    sections: [
      {
        heading: "Molecular Profile",
        body: "Retatrutide is a single-chain synthetic peptide that, in receptor-pharmacology research, is characterised against the GIP, GLP-1, and glucagon receptor families. As a reference material it is used to study receptor identity, binding, and signalling pathways at the bench. Vault Peptides makes no representation regarding any biological effect in humans or animals.",
      },
      {
        heading: "Laboratory Research Applications",
        body: "As an analytical reference standard, Retatrutide is used by academic, biotech, and contract-research laboratories for in-vitro work such as receptor-binding assays, analytical method development, chromatography calibration, and mass-spectrometry reference comparison. All described uses are bench/in-vitro research only.",
      },
      {
        heading: "Analytical Specifications",
        body: "Supplied as a lyophilised powder with a purity specification of ≥ 99% determined by HPLC, with identity confirmed by mass spectrometry. A batch-specific Certificate of Analysis (COA) is available on request and documents purity, identity, and batch number for each lot.",
      },
      {
        heading: "Handling & Storage",
        body: "For laboratory handling only. Store the lyophilised reference standard at 2–8°C, protected from light. Reconstitution and handling should follow the receiving laboratory's standard operating procedures. Not for human or animal use.",
      },
    ],
    disclaimer:
      "Retatrutide is supplied strictly as an analytical/laboratory reference material for in-vitro research use only. It is NOT a drug, food, supplement, or medical product, is NOT for human or animal consumption, and no therapeutic, diagnostic, or clinical use is intended or implied. This content is technical reference information for qualified researchers.",
  },
  "mots-c": {
    title: "What is MOTS-c?",
    sub: "Mitochondria-Derived Peptide",
    desc: "A mitochondrial peptide researched for its role in energy metabolism and insulin sensitivity.",
    intro:
      "MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA-c) is a 16-amino-acid mitochondria-derived peptide encoded within the 12S ribosomal RNA gene. It acts as a novel mitochondrial signalling molecule that regulates metabolic processes and is the subject of active research in ageing and metabolic disease.",
    sections: [
      {
        heading: "Mechanism of Action",
        body: "MOTS-c activates AMPK (AMP-activated protein kinase), a central cellular energy sensor, and influences glucose uptake and utilisation in skeletal muscle. Research indicates it modulates the folate cycle and methionine metabolism, pathways critical to cellular energy homeostasis.",
      },
      {
        heading: "Research Applications",
        body: "Preclinical and early studies have investigated MOTS-c in the context of insulin-signalling pathways, metabolic regulation, and energy homeostasis. Published animal-model literature has examined its association with insulin sensitivity and metabolic markers. All such work is research-stage and described for scientific reference only.",
      },
      {
        heading: "Ageing Research",
        body: "Circulating MOTS-c levels decline with age. Research suggests a potential role in healthy ageing, physical performance preservation, and protection against age-related metabolic decline. It is considered a mitokine — a mitochondria-derived hormone-like factor that acts systemically.",
      },
      {
        heading: "Storage & Handling",
        body: "Lyophilised MOTS-c should be stored at −20°C for long-term stability, or at 2–8°C for short-term use. Protect from freeze-thaw cycles once reconstituted.",
      },
    ],
    disclaimer:
      "MOTS-c is a research peptide. It has not been approved by any regulatory authority for human therapeutic use. This article is for scientific and educational purposes only.",
  },
  "ghk-cu": {
    title: "What is GHK-Cu?",
    sub: "Copper Tripeptide",
    desc: "A naturally occurring copper peptide studied for wound healing and skin remodelling.",
    intro:
      "GHK-Cu (glycyl-L-histidyl-L-lysine:copper) is a naturally occurring human plasma tripeptide that forms a stable complex with copper(II) ions. It was first isolated in 1973 and has since been extensively studied for its roles in wound healing, tissue remodelling, anti-inflammatory signalling, and skin biology.",
    sections: [
      {
        heading: "Mechanism of Action",
        body: "GHK-Cu activates a wide range of biological pathways. It stimulates collagen and glycosaminoglycan synthesis, promotes angiogenesis, modulates the activity of matrix metalloproteinases (MMPs), and exhibits antioxidant activity. Research also indicates it can regulate over 4,000 human genes, influencing both pro-regenerative and anti-inflammatory pathways.",
      },
      {
        heading: "Wound Healing Research",
        body: "GHK-Cu has been studied extensively for accelerating wound closure and improving skin repair quality. Preclinical data suggests it promotes fibroblast proliferation, enhances extracellular matrix production, and reduces post-wound contraction, resulting in superior tissue architecture.",
      },
      {
        heading: "Skin Biology Applications",
        body: "In dermatological research, GHK-Cu is associated with reduced skin laxity, improved skin density, stimulation of hair follicle growth, and reduction in fine lines. Its ability to activate TGF-β pathways makes it of interest in anti-ageing skin research.",
      },
      {
        heading: "Storage & Handling",
        body: "GHK-Cu is relatively stable. Store lyophilised powder at 2–8°C, away from light and moisture. Once in solution, store at −20°C if not used within 24–48 hours.",
      },
    ],
    disclaimer:
      "GHK-Cu is a research compound. It has not been approved for therapeutic use by any regulatory body. All information is for educational and scientific research purposes only.",
  },
  tesamorelin: {
    title: "What is Tesamorelin?",
    sub: "GHRH Analogue",
    desc: "A synthetic growth-hormone-releasing hormone analogue under research for body composition.",
    intro:
      "Tesamorelin is a synthetic analogue of growth-hormone-releasing hormone (GHRH) consisting of the full 44-amino-acid GHRH sequence with a trans-3-hexenoic acid group attached to stabilise the molecule against enzymatic degradation. It stimulates the pituitary gland to produce endogenous growth hormone in a pulsatile, physiologically normal manner.",
    sections: [
      {
        heading: "Mechanism of Action",
        body: "Tesamorelin binds to GHRH receptors in the anterior pituitary, stimulating the synthesis and pulsatile release of growth hormone (GH). In research models, this receptor-mediated mechanism preserves the natural feedback regulation of the hypothalamic-pituitary axis, maintaining GH within physiological ranges.",
      },
      {
        heading: "Approved Clinical Use",
        body: "Tesamorelin (Egrifta®) was approved by the FDA in 2010 for reduction of excess abdominal fat (lipodystrophy) in HIV-infected patients. It is the first and only GHRH analogue approved for clinical use in this context.",
      },
      {
        heading: "Broader Research Applications",
        body: "Outside its approved indication, researchers are studying Tesamorelin in the context of age-related GH decline, muscle physiology, cognitive function in older adults, and non-alcoholic fatty liver disease (NAFLD). Published trials have examined body composition metrics in non-HIV research populations. This is research-stage literature provided for scientific reference only.",
      },
      {
        heading: "Storage & Handling",
        body: "Lyophilised Tesamorelin should be stored refrigerated at 2–8°C. It is sensitive to degradation in solution, so reconstituted peptide should be used promptly.",
      },
    ],
    disclaimer:
      "Outside of its approved HIV-related indication, Tesamorelin is used as a research compound only. This content does not constitute medical advice and is for scientific education purposes.",
  },
  semax: {
    title: "What is Semax?",
    sub: "ACTH-Derived Neuropeptide",
    desc: "A neuroprotective peptide derived from ACTH, studied for cognitive and neurological effects.",
    intro:
      "Semax is a synthetic heptapeptide (Met-Glu-His-Phe-Pro-Gly-Pro) derived from the N-terminal fragment of adrenocorticotropic hormone (ACTH 4–7), with the addition of a proline-glycine-proline C-terminal extension that dramatically increases its metabolic stability. It was developed in Russia and has been approved for clinical use in Russia and Ukraine.",
    sections: [
      {
        heading: "Mechanism of Action",
        body: "Semax exerts its effects primarily through upregulation of Brain-Derived Neurotrophic Factor (BDNF) and its high-affinity receptor TrkB, as well as nerve growth factor (NGF). It has documented effects on serotonin, dopamine, and cholinergic neurotransmitter systems. It also exhibits notable anti-inflammatory activity in neurological tissue.",
      },
      {
        heading: "Cognitive Research",
        body: "Research suggests Semax may enhance working memory, attention, and executive function. Studies in models of cognitive impairment have shown improvements in learning and recall. Its BDNF-upregulating mechanism has made it of interest in research on neuroplasticity and neuroprotection.",
      },
      {
        heading: "Neuroprotective Research",
        body: "Semax has been studied in the context of ischaemic stroke recovery, optic nerve disease, and neurodegenerative conditions. In Russia, it is approved for use in ischaemic stroke management. Preclinical data suggests it may promote neuronal survival under hypoxic conditions.",
      },
      {
        heading: "Storage & Handling",
        body: "Lyophilised Semax should be stored at 2–8°C. Once reconstituted, it should be used within a short period or stored frozen, following the receiving laboratory's standard operating procedures. Not for human or animal use.",
      },
    ],
    disclaimer:
      "Semax is approved for clinical use in Russia and Ukraine. In most other jurisdictions, including India, it is used as a research compound only. This content is for educational purposes and does not constitute medical advice.",
  },
  selank: {
    title: "What is Selank?",
    sub: "Tuftsin Analogue",
    desc: "A synthetic heptapeptide investigated for anxiolytic and immunomodulatory properties.",
    intro:
      "Selank is a synthetic heptapeptide (Thr-Lys-Pro-Arg-Pro-Gly-Pro) derived from the immunomodulatory tetrapeptide tuftsin (Thr-Lys-Pro-Arg), with a Pro-Gly-Pro sequence appended to extend its metabolic half-life. Developed at the Institute of Molecular Genetics of the Russian Academy of Sciences, it has been approved in Russia for use in anxiety disorders.",
    sections: [
      {
        heading: "Mechanism of Action",
        body: "Selank modulates GABAergic neurotransmission and has been shown to influence the expression of several genes related to serotonin transport and brain-derived neurotrophic factor (BDNF). It also exhibits immunomodulatory effects, influencing IL-6, interferon-gamma, and enkephalin levels.",
      },
      {
        heading: "Anxiolytic Research",
        body: "Selank has demonstrated anxiolytic (anti-anxiety) effects comparable to benzodiazepines in preclinical models, without the associated sedation, dependency risk, or cognitive impairment. This profile has made it of significant interest in anxiety and stress research.",
      },
      {
        heading: "Cognitive & Mood Research",
        body: "Research indicates Selank may improve memory consolidation, focus, and mood stability. Its simultaneous action on immune and neurological systems makes it a subject of interest in psychoneuroimmunology — the study of the interaction between psychological processes and the nervous and immune systems.",
      },
      {
        heading: "Storage & Handling",
        body: "Store lyophilised Selank at 2–8°C, protected from light. Once reconstituted, use promptly, following the receiving laboratory's standard operating procedures. Not for human or animal use.",
      },
    ],
    disclaimer:
      "Selank is approved in Russia for anxiety disorders. In most other jurisdictions, it is used as a research compound only. This is educational content and does not constitute medical advice.",
  },
  "wolverine-blend": {
    title: "What is Wolverine Blend?",
    sub: "Regenerative Stack",
    desc: "A proprietary peptide combination studied in tissue-repair research.",
    intro:
      "Wolverine Blend is a proprietary Vault Peptides formulation combining peptides studied in the context of tissue-repair and musculoskeletal-regeneration research. The blend is designed for laboratory study across multiple repair pathways.",
    sections: [
      {
        heading: "Research Focus",
        body: "The component peptides in Wolverine Blend have individually been studied for their effects on collagen synthesis, angiogenesis, inflammation modulation, and satellite cell activation — biological processes central to muscle and connective tissue repair following physical stress or injury.",
      },
      {
        heading: "Potential Applications in Research",
        body: "Researchers studying tissue repair, post-surgical recovery models, musculoskeletal injury, and wound healing have shown interest in the individual components of regenerative peptide stacks. Combined formulations are designed to achieve complementary and additive effects across these pathways.",
      },
      {
        heading: "Synergistic Approach",
        body: "The rationale for a peptide blend lies in studying multiple rate-limiting steps of tissue repair in parallel — angiogenesis (blood supply to healing tissue), inflammation modulation (regulating inflammatory signalling), and structural matrix repair (collagen and fibronectin production).",
      },
      {
        heading: "Storage & Handling",
        body: "Store lyophilised Wolverine Blend at 2–8°C, away from light. Once reconstituted, use promptly and do not refreeze unless specified by laboratory protocols.",
      },
    ],
    disclaimer:
      "Wolverine Blend is a proprietary research formulation. It has not been evaluated or approved by any regulatory body for therapeutic use. For research purposes only.",
  },
  "klow-blend": {
    title: "What is Klow Blend?",
    sub: "Inflammation Modulation Stack",
    desc: "A research formulation targeting inflammation and joint-health pathways.",
    intro:
      "Klow Blend is a proprietary Vault Peptides formulation combining peptides researched for their roles in modulating inflammatory signalling pathways and supporting joint and connective tissue health. It is designed for research into inflammation-associated conditions.",
    sections: [
      {
        heading: "Research Focus",
        body: "The peptides within Klow Blend have been individually studied for their anti-inflammatory properties, ability to modulate cytokine expression (particularly IL-1β, IL-6, and TNF-α), and support of cartilage and synovial tissue health in preclinical models.",
      },
      {
        heading: "Inflammatory Pathway Modulation",
        body: "Chronic low-grade inflammation is implicated in numerous conditions, from metabolic disease to joint degeneration and neurological decline. Peptide research in this area explores targeted modulation of pro-inflammatory cascades while preserving normal immune function.",
      },
      {
        heading: "Joint Health Research",
        body: "Preclinical models of joint disease have used peptide combinations to study cartilage preservation, synovial membrane health, and reduction of pain signalling. Research in this area is of broad interest for osteoarthritis and sports-related joint overuse conditions.",
      },
      {
        heading: "Storage & Handling",
        body: "Store lyophilised Klow Blend at 2–8°C. Once reconstituted, use within the time frame specified by your research protocol. Avoid repeated freeze-thaw cycles.",
      },
    ],
    disclaimer:
      "Klow Blend is a proprietary research formulation. It has not been evaluated or approved by any regulatory body for therapeutic use. For research purposes only.",
  },
  "glow-blend": {
    title: "What is Glow Blend?",
    sub: "Skin Rejuvenation Stack",
    desc: "A peptide combination developed for skin rejuvenation and anti-ageing research.",
    intro:
      "Glow Blend is a proprietary Vault Peptides formulation combining peptides studied for their roles in skin biology, collagen synthesis, melanogenesis regulation, and dermal regeneration. It targets multiple skin-ageing pathways in a single research formulation.",
    sections: [
      {
        heading: "Research Focus",
        body: "The component peptides in Glow Blend have individually been researched for their effects on fibroblast activity, collagen and elastin production, hyaluronic acid synthesis, and extracellular matrix remodelling — all central mechanisms in skin ageing and repair biology.",
      },
      {
        heading: "Anti-Ageing Skin Research",
        body: "Age-related changes in skin involve progressive loss of collagen density, reduced hyaluronic acid content, impaired wound healing, and altered melanocyte activity. Research peptides targeting growth factor signalling, copper metabolism, and TGF-β pathways are of active interest in dermatological science.",
      },
      {
        heading: "Collagen and Elastin Pathways",
        body: "Multiple components of Glow Blend interact with pathways that regulate dermal fibroblast behaviour. In vitro and in vivo studies have demonstrated that several of these peptide classes can increase type I and III collagen production and improve elastin fibre architecture.",
      },
      {
        heading: "Storage & Handling",
        body: "Store lyophilised Glow Blend at 2–8°C, protected from light. Once reconstituted, use promptly. Long-term storage of reconstituted solution is not recommended.",
      },
    ],
    disclaimer:
      "Glow Blend is a proprietary research formulation. It has not been evaluated or approved by any regulatory body for therapeutic use. For research purposes only.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return {};
  return {
    title: `${article.title} | Research Hub | Vault Peptides`,
    description: article.desc,
  };
}

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) notFound();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        {/* Header — solid bg so the 3D spine background can't bleed through the text */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-16 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 text-xs font-sans text-primary/70 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Research Hub
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase">
                {article.sub}
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-6 leading-tight" style={{ color: "#1A0E05" }}>
              {article.title}
            </h1>
            <p className="font-sans text-sm leading-relaxed max-w-2xl" style={{ color: "#3D2510" }}>
              {article.intro}
            </p>
          </div>
        </section>

        {/* Article body */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-16 px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl">
          <div className="space-y-8">
            {article.sections.map((section) => (
              <div
                key={section.heading}
                className="bg-card border border-border rounded-lg p-8"
              >
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {section.heading}
                </h2>
                <p className="font-sans text-sm text-foreground/65 leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="font-sans text-xs text-foreground/60 italic leading-relaxed">
              <strong className="font-semibold not-italic text-foreground/80">Research Disclaimer: </strong>
              {article.disclaimer}
            </p>
          </div>
          </div>
        </section>
      </main>
    </div>
  );
}
