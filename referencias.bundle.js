/**
 * referencias.bundle.js
 * Dataset bibliográfico + utilidades de busca/formatação + ENDPOINTS Express.
 * Uso:
 *   const { initReferenciasAPI, searchReferencias, formatAPA } = require("./referencias.bundle");
 *   initReferenciasAPI(app, { basePath: "/api/referencias" });
 */

"use strict";

const express = require("express");

/* ===========================
 * DATASET DE REFERÊNCIAS
 * =========================== */

const referencias = {
  fenomenologica: [
    {
      id: "binswanger-1942",
      category: "fenomenologica",
      type: "book",
      authors: ["Binswanger, Ludwig"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 1942,
      title: "Grundformen und Erkenntnis menschlichen Daseins",
      language: "de",
      journal: null,
      publisher: null,
      city: null,
      edition: null,
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: [
        "fenomenologia",
        "psiquiatria fenomenológica",
        "Daseinsanalyse",
      ],
      notes: null,
    },
    {
      id: "blankenburg-1971",
      category: "fenomenologica",
      type: "book",
      authors: ["Blankenburg, Wolfgang"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 1971,
      title: "Der Verlust der natürlichen Selbstverständlichkeit",
      language: "de",
      journal: null,
      publisher: "Enke",
      city: "Stuttgart",
      edition: null,
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: ["natural attitude", "esquizofrenia", "fenomenologia"],
      notes: null,
    },
    {
      id: "jaspers-1913",
      category: "fenomenologica",
      type: "book",
      authors: ["Jaspers, Karl"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 1913,
      title: "Allgemeine Psychopathologie (Psicopatologia Geral)",
      language: "de",
      journal: null,
      publisher: null,
      city: "Heidelberg",
      edition: "1",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: ["metodologia", "compreensão vs explicação", "psicopatologia"],
      notes: null,
    },
    {
      id: "minkowski-1933",
      category: "fenomenologica",
      type: "book",
      authors: ["Minkowski, Eugène"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 1933,
      title: "Le Temps vécu",
      language: "fr",
      journal: null,
      publisher: null,
      city: null,
      edition: null,
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: ["tempo vivido", "depressão", "fenomenologia do tempo"],
      notes: null,
    },
    {
      id: "tellenbach-1961",
      category: "fenomenologica",
      type: "book",
      authors: ["Tellenbach, Hubertus"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 1961,
      title: "Melancholie",
      language: "de",
      journal: null,
      publisher: "Springer",
      city: "Berlin",
      edition: null,
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: ["typus melancholicus", "melancolia"],
      notes: null,
    },
  ],

  cientifica: [
    /* --- Autor corporativo / diretrizes --- */
    {
      id: "apa-mdd-2010",
      category: "cientifica",
      type: "guideline",
      authors: ["American Psychiatric Association"],
      editors: [],
      corporate_author: "American Psychiatric Association",
      contributors: [
        "Gelenberg, Alan J. (Chair)",
        "Freeman, Marlene P.",
        "Markowitz, John C.",
        "Rosenbaum, Jerrold F.",
        "Thase, Michael E.",
        "Trivedi, Madhukar H.",
        "Van Rhoads, Richard S. (Consultant)",
        "Reus, Victor I. (Independent Review Panel, Chair)",
        "DePaulo, J. Raymond, Jr.",
        "Fawcett, Jan A.",
        "Schneck, Christopher D.",
        "Silbersweig, David A.",
      ],
      year: 2010,
      title:
        "Practice Guideline for the Treatment of Patients With Major Depressive Disorder (3rd ed.)",
      language: "en",
      journal: null,
      publisher: "American Psychiatric Association",
      city: "Arlington, VA",
      edition: "3",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "https://psychiatryonline.org/pb/assets/raw/sitewide/practice_guidelines/guidelines/mdd.pdf",
      keywords: ["depressão maior", "tratamento", "diretriz"],
      notes:
        "Diretriz oficial APA (grupo de trabalho listado em contributors).",
    },
    {
      id: "who-icd11-2019",
      category: "cientifica",
      type: "classification",
      authors: ["World Health Organization"],
      editors: [],
      corporate_author: "World Health Organization",
      contributors: [],
      year: 2019,
      title:
        "International Classification of Diseases, 11th Revision (ICD-11) – MMS",
      language: "en",
      journal: null,
      publisher: "WHO",
      city: "Geneva",
      edition: "ICD-11 MMS 2019-04",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "https://icd.who.int/browse/2019-04/mms/en",
      keywords: ["CID-11", "classificação diagnóstica", "transtornos mentais"],
      notes: "Versão estável liberada em 2018; endosso em 2019.",
    },

    /* --- WFSBP Unipolar Depression --- */
    {
      id: "wfsbp-2013-part1",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Bauer, Michael",
        "Pfennig, Andrea",
        "Severus, Emanuel",
        "Whybrow, Peter C.",
        "Angst, Jules",
        "Möller, Hans-Jürgen",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2013,
      title:
        "WFSBP Guidelines for Biological Treatment of Unipolar Depressive Disorders, Part 1: Acute and Continuation Treatment",
      language: "en",
      journal: "The World Journal of Biological Psychiatry",
      publisher: null,
      city: null,
      edition: null,
      volume: "14",
      issue: "5",
      pages: "334–385",
      doi: "10.3109/15622975.2013.804195",
      isbn: null,
      url: "https://wfsbp.org/wp-content/uploads/2023/02/WFSBP_TG_Unipolar_depressive_disorders_Bauer_et_al_2013.pdf",
      keywords: [
        "depressão unipolar",
        "tratamento agudo",
        "continuação",
        "biológico",
      ],
      notes: null,
    },
    {
      id: "wfsbp-2015-part2",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Bauer, Michael",
        "Severus, Emanuel",
        "Köhler, Sebastian",
        "Whybrow, Peter C.",
        "Angst, Jules",
        "Möller, Hans-Jürgen",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2015,
      title:
        "WFSBP Guidelines for Biological Treatment of Unipolar Depressive Disorders, Part 2: Maintenance Treatment & Chronic/Subthreshold",
      language: "en",
      journal: "The World Journal of Biological Psychiatry",
      publisher: null,
      city: null,
      edition: null,
      volume: "16",
      issue: "2",
      pages: "76–95",
      doi: "10.3109/15622975.2014.1001786",
      isbn: null,
      url: "",
      keywords: ["manutenção", "depressão crônica", "profilaxia"],
      notes: null,
    },

    /* --- CANMAT 2016 (todas as seções) --- */
    {
      id: "canmat-2016-sec1",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Lam, Raymond W.",
        "McIntosh, David",
        "Wang, JianLi",
        "Enns, Murray W.",
        "Kolivakis, Thomas",
        "Michalak, Erin E.",
        "Sareen, Jitender",
        "Song, Wen-Yi",
        "Kennedy, Sidney H.",
        "MacQueen, Glenda M.",
        "Milev, Roumen V.",
        "Parikh, Sagar V.",
        "Ravindran, Arun V.",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2016,
      title:
        "CANMAT 2016 Clinical Guidelines for MDD in Adults: Section 1. Disease Burden and Principles of Care",
      language: "en",
      journal: "Canadian Journal of Psychiatry",
      volume: "61",
      issue: "9",
      pages: "510–523",
      doi: null,
      isbn: null,
      url: "https://pubmed.ncbi.nlm.nih.gov/27486151/",
      keywords: ["depressão", "princípios de cuidado", "CANMAT"],
      notes: null,
    },
    {
      id: "canmat-2016-sec2",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Parikh, Sagar V.",
        "Quilty, Lena C.",
        "Ravitz, Paula",
        "Rosenbluth, Michael",
        "Pavlova, Bojana",
        "Grigoriadis, Sophie",
        "Velyvis, Vid",
        "Kennedy, Sidney H.",
        "Lam, Raymond W.",
        "MacQueen, Glenda M.",
        "Milev, Roumen V.",
        "Ravindran, Arun V.",
        "Uher, Rudolf",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2016,
      title:
        "CANMAT 2016 Clinical Guidelines for MDD in Adults: Section 2. Psychological Treatments",
      language: "en",
      journal: "Canadian Journal of Psychiatry",
      volume: "61",
      issue: "9",
      pages: "524–539",
      doi: null,
      isbn: null,
      url: "https://pubmed.ncbi.nlm.nih.gov/27486150/",
      keywords: ["psicoterapia", "TCC", "terapias psicológicas"],
      notes: null,
    },
    {
      id: "canmat-2016-sec3",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Kennedy, Sidney H.",
        "Lam, Raymond W.",
        "McIntyre, Roger S.",
        "Tourjman, Sebastien V.",
        "Bhat, Vijay",
        "Blier, Pierre",
        "Hasnain, Muhammad",
        "Jollant, François",
        "Levitt, Anthony J.",
        "MacQueen, Glenda M.",
        "McIntosh, David",
        "Milev, Roumen V.",
        "Parikh, Sagar V.",
        "Ravindran, Arun V.",
        "Uher, Rudolf",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2016,
      title:
        "CANMAT 2016 Clinical Guidelines for MDD in Adults: Section 3. Pharmacological Treatments",
      language: "en",
      journal: "Canadian Journal of Psychiatry",
      volume: "61",
      issue: "9",
      pages: "540–560",
      doi: null,
      isbn: null,
      url: "https://pubmed.ncbi.nlm.nih.gov/27486148/",
      keywords: ["antidepressivos", "farmacoterapia"],
      notes: null,
    },
    {
      id: "canmat-2016-sec4",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Ravindran, Arun V.",
        "Balneaves, Lynda G.",
        "Faulkner, Guy",
        "Ortiz, Alejandra",
        "McIntosh, David",
        "Morehouse, R. Leah",
        "Ravindran, Latha V.",
        "Yatham, Lakshmi N.",
        "Kennedy, Sidney H.",
        "Lam, Raymond W.",
        "MacQueen, Glenda M.",
        "Milev, Roumen V.",
        "Parikh, Sagar V.",
        "Uher, Rudolf",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2016,
      title:
        "CANMAT 2016 Clinical Guidelines for MDD in Adults: Section 4. Neurostimulation, Exercise, Complementary & Alternative Medicine",
      language: "en",
      journal: "Canadian Journal of Psychiatry",
      volume: "61",
      issue: "9",
      pages: "561–575",
      doi: null,
      isbn: null,
      url: "https://pubmed.ncbi.nlm.nih.gov/27486147/",
      keywords: ["ECT", "rTMS", "exercício", "medicina complementar"],
      notes: null,
    },
    {
      id: "canmat-2016-sec5",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Parikh, Sagar V.",
        "Quilty, Lena C.",
        "Kennedy, Sidney H.",
        "Ravindran, Arun V.",
        "Lam, Raymond W.",
        "MacQueen, Glenda M.",
        "Milev, Roumen V.",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2016,
      title:
        "CANMAT 2016 Clinical Guidelines for MDD in Adults: Section 5. Special Populations",
      language: "en",
      journal: "Canadian Journal of Psychiatry",
      volume: "61",
      issue: "9",
      pages: "576–587",
      doi: null,
      isbn: null,
      url: "https://pubmed.ncbi.nlm.nih.gov/27486149/",
      keywords: ["gestação", "idosos", "comorbidades"],
      notes: null,
    },
    {
      id: "canmat-2016-sec6",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Lam, Raymond W.",
        "McIntosh, David",
        "Wang, JianLi",
        "Enns, Murray W.",
        "Yatham, Lakshmi N.",
        "Kennedy, Sidney H.",
        "MacQueen, Glenda M.",
        "Milev, Roumen V.",
        "Parikh, Sagar V.",
        "Ravindran, Arun V.",
      ],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2016,
      title:
        "CANMAT 2016 Clinical Guidelines for MDD in Adults: Section 6. Service Organization & Access to Care",
      language: "en",
      journal: "Canadian Journal of Psychiatry",
      volume: "61",
      issue: "9",
      pages: "588–603",
      doi: null,
      isbn: null,
      url: "https://pubmed.ncbi.nlm.nih.gov/27486152/",
      keywords: ["organização de serviços", "acesso", "atenção primária"],
      notes: null,
    },

    /* --- ABP (exemplo de diretriz com todos autores) --- */
    {
      id: "abp-suicidio-2021-part2",
      category: "cientifica",
      type: "guideline",
      authors: [
        "Baldaçara, Leonardo",
        "Grudtner, Rodrigo R.",
        "Leite, Vanessa S. da S.",
        "Porto, Daniel M.",
        "Robis, Karina P.",
        "Fidalgo, Tiago M.",
        "Rocha, Giordano A.",
        "Diaz, Alejandro P.",
        "Meleiro, Alexandra",
        "Correa, Humberto",
        "Tung, Tami C.",
        "Malloy-Diniz, Leandro",
        "Quevedo, João",
        "da Silva, Antônio G.",
      ],
      editors: [],
      corporate_author: "Associação Brasileira de Psiquiatria",
      contributors: [],
      year: 2021,
      title:
        "Brazilian Psychiatric Association guidelines for the management of suicidal behavior. Part 2: Screening, Intervention, and Prevention",
      language: "en",
      journal: "Brazilian Journal of Psychiatry",
      volume: "43",
      issue: "5",
      pages: "525–537",
      doi: "10.1590/1516-4446-2020-1108",
      isbn: null,
      url: "https://pubmed.ncbi.nlm.nih.gov/33739849/",
      keywords: ["prevenção do suicídio", "triagem", "intervenção"],
      notes: null,
    },

    /* --- Classificações/Manuais e Livros-Texto --- */
    {
      id: "apa-dsm5-2013",
      category: "cientifica",
      type: "classification",
      authors: ["American Psychiatric Association"],
      editors: [],
      corporate_author: "American Psychiatric Association",
      contributors: [],
      year: 2013,
      title: "Diagnostic and Statistical Manual of Mental Disorders (DSM-5)",
      language: "en",
      journal: null,
      publisher: "American Psychiatric Publishing",
      city: "Washington, DC",
      edition: "5",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "978-0890425558",
      url: "",
      keywords: ["DSM-5", "classificação", "diagnóstico"],
      notes: null,
    },
    {
      id: "kaplan-sadock-2007",
      category: "cientifica",
      type: "book",
      authors: ["Sadock, Benjamin J.", "Sadock, Virginia A."],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2007,
      title:
        "Kaplan & Sadock's Synopsis of Psychiatry: Behavioral Sciences/Clinical Psychiatry",
      language: "en",
      journal: null,
      publisher: "Lippincott Williams & Wilkins",
      city: "Philadelphia",
      edition: "10",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "978-0781773270",
      url: "",
      keywords: ["psiquiatria clínica", "livro-texto"],
      notes: null,
    },
    {
      id: "stahl-2021",
      category: "cientifica",
      type: "book",
      authors: ["Stahl, Stephen M."],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2021,
      title:
        "Stahl's Essential Psychopharmacology: Neuroscientific Basis and Practical Applications",
      language: "en",
      journal: null,
      publisher: "Cambridge University Press",
      city: "Cambridge",
      edition: "5",
      volume: null,
      issue: null,
      pages: null,
      doi: "10.1017/9781108975292",
      isbn: "978-1108838573",
      url: "https://www.cambridge.org/core/books/stahls-essential-psychopharmacology/1231F597AE3471AE53B1CC9AFDA34B32",
      keywords: ["psicofarmacologia", "mecanismos", "aplicações clínicas"],
      notes: null,
    },
    {
      id: "dalgalarrondo-2018",
      category: "cientifica",
      type: "book",
      authors: ["Dalgalarrondo, Paulo"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2018,
      title: "Psicopatologia e Semiologia dos Transtornos Mentais",
      language: "pt",
      journal: null,
      publisher: "Artmed",
      city: "Porto Alegre",
      edition: "3",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "978-8582714155",
      url: "",
      keywords: ["psicopatologia clínica", "semiologia"],
      notes: null,
    },
    {
      id: "louzacordas-2019",
      category: "cientifica",
      type: "book",
      authors: ["Louzã, Mário R.", "Cordás, Táki A."],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2019,
      title: "Transtornos da Personalidade",
      language: "pt",
      journal: null,
      publisher: "Artmed",
      city: "Porto Alegre",
      edition: "2",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "978-8582715848",
      url: "",
      keywords: ["personalidade", "psiquiatria"],
      notes: "E-book com edição de 2020 também disponível.",
    },
    {
      id: "quevedo-izquierdo-2002",
      category: "cientifica",
      type: "book",
      authors: ["Quevedo, João", "Izquierdo, Iván"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2002,
      title: "Neurobiologia dos Transtornos Psiquiátricos",
      language: "pt",
      journal: null,
      publisher: "Artmed",
      city: "Porto Alegre",
      edition: "1",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: ["neurobiologia", "psiquiatria biológica"],
      notes: null,
    },
    {
      id: "quevedo-emergencias-2019",
      category: "cientifica",
      type: "book",
      authors: [],
      editors: ["Quevedo, João"],
      corporate_author: null,
      contributors: [],
      year: 2019,
      title: "Emergências Psiquiátricas",
      language: "pt",
      journal: null,
      publisher: "Artmed",
      city: "Porto Alegre",
      edition: "4",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "978-8582715411",
      url: "",
      keywords: ["emergências", "urgências"],
      notes: null,
    },
    {
      id: "sallet-manual-residente-2023",
      category: "cientifica",
      type: "book",
      authors: [],
      editors: ["Sallet, Paulo Clemente"],
      corporate_author: null,
      contributors: [],
      year: 2023,
      title: "Manual do Residente de Psiquiatria (IPq-HC/FMUSP)",
      language: "pt",
      journal: null,
      publisher: "Manole",
      city: "Barueri",
      edition: "1",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "9786555767755",
      url: "",
      keywords: ["formação", "residência médica"],
      notes: null,
    },
    {
      id: "castellana-entrevista-2022",
      category: "cientifica",
      type: "book",
      authors: [],
      editors: [
        "Castellana, Gustavo Bonini",
        "Guimarães-Fernandes, Flávio",
        "Sallet, Paulo Clemente",
      ],
      corporate_author: null,
      contributors: [],
      year: 2022,
      title: "Psicopatologia Clínica e Entrevista Psiquiátrica",
      language: "pt",
      journal: null,
      publisher: "Manole",
      city: "Barueri",
      edition: "1",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "978-6555766963",
      url: "",
      keywords: ["entrevista psiquiátrica", "psicopatologia clínica"],
      notes: null,
    },
    {
      id: "cheniaux-2018",
      category: "cientifica",
      type: "book",
      authors: ["Cheniaux, Elie"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2018,
      title: "Manual de Psicopatologia",
      language: "pt",
      journal: null,
      publisher: "Manole",
      city: "Barueri",
      edition: "6",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: "9788535284521",
      url: "",
      keywords: ["psicopatologia", "manual"],
      notes: null,
    },
    {
      id: "messas-tamelini-2010",
      category: "cientifica",
      type: "book",
      authors: ["Messas, Guilherme", "Tamelini, Melissa"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2010,
      title: "Fundamentos de Clínica Fenomenológica",
      language: "pt",
      journal: null,
      publisher: "Roca",
      city: "São Paulo",
      edition: "1",
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: ["fenomenologia clínica", "avaliação psiquiátrica"],
      notes: null,
    },
    {
      id: "alonso-fernandez-1995",
      category: "cientifica",
      type: "book",
      authors: ["Alonso-Fernández, Francisco"],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 1995,
      title: "Compêndio de Psiquiatria",
      language: "es",
      journal: null,
      publisher: "Paz Montalvo",
      city: "Madrid",
      edition: null,
      volume: null,
      issue: null,
      pages: null,
      doi: null,
      isbn: null,
      url: "",
      keywords: ["psiquiatria", "manual"],
      notes: null,
    },
  ],

  integrativa: [
    {
      id: "fuchs-2009",
      category: "integrativa",
      type: "article",
      authors: ["Fuchs, Thomas", "Schlimme, J. E."],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2009,
      title: "Embodiment and Psychopathology: A Phenomenological Perspective",
      language: "en",
      journal: "Current Opinion in Psychiatry",
      volume: "22",
      issue: "6",
      pages: "570–575",
      doi: "10.1097/YCO.0b013e3283318e5c",
      isbn: null,
      url: "",
      keywords: ["fenomenologia", "corporeidade", "psicopatologia"],
      notes: null,
    },
    {
      id: "kendler-2016",
      category: "integrativa",
      type: "article",
      authors: ["Kendler, Kenneth S."],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2016,
      title:
        "The Phenomenology of Major Depression and the Representativeness and Nature of DSM Criteria",
      language: "en",
      journal: "American Journal of Psychiatry",
      volume: "173",
      issue: "8",
      pages: "771–780",
      doi: "10.1176/appi.ajp.2016.15121509",
      isbn: null,
      url: "",
      keywords: ["depressão", "fenomenologia", "DSM"],
      notes: null,
    },
    {
      id: "parnas-sass-2011",
      category: "integrativa",
      type: "chapter",
      authors: ["Parnas, Josef", "Sass, Louis A."],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2011,
      title: "The Structure of Self-Consciousness in Schizophrenia",
      language: "en",
      journal: "In: S. Gallagher (Ed.), The Oxford Handbook of the Self",
      publisher: "Oxford University Press",
      city: "Oxford",
      edition: null,
      volume: null,
      issue: null,
      pages: "521–546",
      doi: null,
      isbn: null,
      url: "",
      keywords: ["ipseidade", "autoconsciência", "esquizofrenia"],
      notes: null,
    },
    {
      id: "stanghellini-broome-2014",
      category: "integrativa",
      type: "editorial",
      authors: ["Stanghellini, Giovanni", "Broome, Matthew R."],
      editors: [],
      corporate_author: null,
      contributors: [],
      year: 2014,
      title: "Psychopathology as the Basic Science of Psychiatry",
      language: "en",
      journal: "The British Journal of Psychiatry",
      volume: "205",
      issue: "3",
      pages: "169–170",
      doi: "10.1192/bjp.bp.113.138974",
      isbn: null,
      url: "",
      keywords: ["psicopatologia", "ciência básica"],
      notes: null,
    },
  ],
};

/* ===========================
 * FUNÇÕES UTILITÁRIAS
 * =========================== */

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s:/.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toInitials(person = "") {
  if (!person) return "";
  if (person.includes(",")) {
    const parts = person.split(",");
    const last = parts[0].trim();
    const givenRaw = parts.slice(1).join(",").trim();
    const initials = (givenRaw || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => (w[0] || "").toUpperCase() + ".")
      .join(" ");
    return `${last}, ${initials}`.trim();
  }
  const tokens = person.trim().split(/\s+/);
  const last = tokens.pop() || "";
  const initials = tokens
    .map((p) => (p[0] || "").toUpperCase() + ".")
    .join(" ");
  return `${last}, ${initials}`.trim();
}

function formatAuthorsAPA({
  authors = [],
  editors = [],
  corporate_author = "",
}) {
  if (authors && authors.length) {
    const arr = authors.map(toInitials);
    return arr.length === 1
      ? arr[0]
      : `${arr.slice(0, -1).join(", ")}, & ${arr.slice(-1)[0]}`;
  }
  if (editors && editors.length) {
    const arr = editors.map(toInitials);
    const names =
      arr.length === 1
        ? arr[0]
        : `${arr.slice(0, -1).join(", ")}, & ${arr.slice(-1)[0]}`;
    return names; // sufixo (Ed./Eds.) será adicionado no título
  }
  if (corporate_author) return corporate_author;
  return "";
}

function formatWhere(entry) {
  if (entry.journal) {
    let s = entry.journal;
    if (entry.volume) s += `, ${entry.volume}`;
    if (entry.issue) s += `(${entry.issue})`;
    if (entry.pages) s += `, ${entry.pages}`;
    return s;
  }
  if (entry.publisher || entry.city || entry.edition) {
    let s = "";
    if (entry.city) s += `${entry.city}: `;
    if (entry.publisher) s += entry.publisher;
    if (entry.edition) s += ` (${entry.edition} ed.)`;
    return s || entry.organization || "";
  }
  return entry.organization || "";
}

function formatIds(entry) {
  if (entry.doi) return ` https://doi.org/${entry.doi}`;
  if (entry.isbn) return ` ISBN ${entry.isbn}`;
  if (entry.url) return ` ${entry.url}`;
  return "";
}

function formatTitleAPA(entry) {
  const t = entry.title || "";
  if (
    entry.type === "book" ||
    entry.type === "classification" ||
    entry.type === "guideline"
  ) {
    return `*${t}*`;
  }
  return t;
}

function formatAPA(entry) {
  const A = formatAuthorsAPA(entry);
  const year = entry.year ? `(${entry.year}).` : "(s.d.).";
  const editorsSuffix =
    !(entry.authors && entry.authors.length) &&
    entry.editors &&
    entry.editors.length
      ? entry.editors.length > 1
        ? " (Eds.)."
        : " (Ed.)."
      : "";
  const title = formatTitleAPA(entry);
  const where = formatWhere(entry);
  const ids = formatIds(entry);
  const endDot = where && !where.trim().endsWith(".") ? "." : "";
  return `${
    A ? A + " " : ""
  }${year} ${title}${editorsSuffix} ${where}${endDot}${ids}`.trim();
}

function scoreHit(
  entry,
  qTokens,
  fields = ["title", "authors", "journal", "publisher", "keywords"]
) {
  const weights = {
    title: 5,
    authors: 4,
    journal: 3,
    publisher: 2,
    keywords: 3,
    notes: 1,
  };
  let score = 0;
  for (const field of fields) {
    const val = Array.isArray(entry[field])
      ? entry[field].join(" ")
      : entry[field] || "";
    const norm = normalize(val);
    for (const tok of qTokens) {
      if (norm.includes(tok)) score += weights[field] || 1;
    }
  }
  return score;
}

function computeFirstAuthorSort(a) {
  const name =
    (a.authors && a.authors[0]) ||
    a.corporate_author ||
    (a.editors && a.editors[0]) ||
    "";
  return normalize(name);
}

const referencias_flat = Object.entries(referencias)
  .flatMap(([category, arr]) =>
    arr.map((r) => ({
      ...r,
      category,
      first_author_sort: computeFirstAuthorSort(r),
    }))
  )
  .sort((a, b) => (a.first_author_sort > b.first_author_sort ? 1 : -1));

function searchReferencias({
  query = "",
  category = null,
  yearFrom = null,
  yearTo = null,
  limit = 100,
} = {}) {
  const qTokens = normalize(query).split(" ").filter(Boolean);
  const pool = referencias_flat.filter(
    (r) => !category || r.category === category
  );
  const filtered = pool.filter((r) => {
    const yf = yearFrom ?? -Infinity;
    const yt = yearTo ?? Infinity;
    const okYear = (r.year ?? 0) >= yf && (r.year ?? 0) <= yt;
    if (!qTokens.length) return okYear;
    const s = scoreHit(r, qTokens);
    return okYear && s > 0;
  });
  const ranked = qTokens.length
    ? filtered
        .map((r) => ({ ...r, _score: scoreHit(r, qTokens) }))
        .sort(
          (a, b) =>
            b._score - a._score ||
            (a.first_author_sort > b.first_author_sort ? 1 : -1)
        )
    : filtered.sort((a, b) =>
        a.first_author_sort > b.first_author_sort ? 1 : -1
      );
  return ranked.slice(0, limit).map(({ _score, ...rest }) => rest);
}

/* ===========================
 * ENDPOINTS EXPRESS
 * =========================== */

function initReferenciasAPI(app, { basePath = "/api/referencias" } = {}) {
  const router = express.Router();

  // Resumo de categorias
  router.get("/", (req, res) => {
    const summary = Object.fromEntries(
      Object.entries(referencias).map(([k, arr]) => [k, { total: arr.length }])
    );
    res.json({ categorias: summary, total: referencias_flat.length });
  });

  // Busca
  router.get("/search", (req, res) => {
    try {
      const {
        query = "",
        category = null,
        yearFrom = null,
        yearTo = null,
        limit = 50,
      } = req.query;
      const results = searchReferencias({
        query,
        category:
          category &&
          ["fenomenologica", "cientifica", "integrativa"].includes(category)
            ? category
            : null,
        yearFrom: yearFrom ? Number(yearFrom) : null,
        yearTo: yearTo ? Number(yearTo) : null,
        limit: Math.min(Number(limit) || 50, 200),
      });
      res.json({ count: results.length, results });
    } catch (e) {
      console.error("Erro /search:", e);
      res.status(500).json({ erro: "Falha na busca" });
    }
  });

  // Obter item por ID
  router.get("/:id", (req, res) => {
    const id = String(req.params.id);
    const item = referencias_flat.find((r) => r.id === id);
    if (!item)
      return res.status(404).json({ erro: "Referência não encontrada" });
    res.json(item);
  });

  // Citação pronta (string)
  router.get("/:id/citation", (req, res) => {
    const id = String(req.params.id);
    const item = referencias_flat.find((r) => r.id === id);
    if (!item)
      return res.status(404).json({ erro: "Referência não encontrada" });
    res.json({ id, citation: formatAPA(item) });
  });

  // Strings APA por categoria
  router.get("/strings/:cat", (req, res) => {
    const cat = String(req.params.cat);
    if (!["fenomenologica", "cientifica", "integrativa"].includes(cat)) {
      return res.status(400).json({ erro: "Categoria inválida" });
    }
    const strings = (referencias[cat] || []).map(formatAPA);
    res.json({ categoria: cat, total: strings.length, referencias: strings });
  });

  // Dumps JSON
  router.get("/json", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(JSON.stringify(referencias, null, 2));
  });

  router.get("/json/flat", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(JSON.stringify(referencias_flat, null, 2));
  });

  app.use(basePath, router);
}

/* ===========================
 * EXPORTS
 * =========================== */
module.exports = {
  initReferenciasAPI,
  referencias,
  referencias_flat,
  searchReferencias,
  formatAPA,
  normalize,
};
