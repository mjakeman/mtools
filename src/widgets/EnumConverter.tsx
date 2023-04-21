import { Options, parse } from 'csv-parse/browser/esm/sync';
import { useEffect, useRef, useState } from 'react';

function escapeChars(str: string, removeWhitespace: boolean = false) {
    if (removeWhitespace)
        return str.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, '_');

    return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

function EnumConverter() {

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const resultAreaRef = useRef<HTMLTextAreaElement|null>(null);
    const [csvData, setCsvData] = useState<Record<string, any>|null>(null);
    const [fieldTitleIndex, setFieldTitleIndex] = useState<number>(2);

    function doCsvParse() {
        const options: Options = {
            delimiter: ',',
            columns: true,
            skip_empty_lines: true
        };

        const data = parse(textAreaRef.current!.value, options);
        setCsvData(data);
    }

    function loadCsv() {
        textAreaRef.current!.value = testData;
    }

    useEffect(() => {
        if (csvData == null)
            return;

        var first = true;

        try {

            var genCode = `public enum Table {\n`;
            
            var columns: string[] = [];
            var entries: string[] = [];

            for (const [key, value] of Object.entries(csvData)) {

                var params: string[] = [];

                var name = "";

                Object.entries(value).forEach(([subkey, subvalue], index) => {
                    if (index == fieldTitleIndex)
                        name = escapeChars(`${subvalue}`, true).replace(' ', '_').toUpperCase();

                    if (first) {
                        columns.push(subkey);
                    }
                    params.push(`"${subvalue}"`);
                });

                const entryCode = `\t${name}(${params.join(", ")})`;
                entries.push(entryCode);

                first = false;
            }

            genCode += entries.join(",\n") + ";\n\n";

            for (const col in columns) {
                const sanitisedName = escapeChars(columns[col]);
                genCode += "\tString " + sanitisedName + ";\n";
            }

            genCode += "\n";

            genCode += `\tTable(${columns.map(col => {
                return `String ${escapeChars(col)}`
            }).join(', ')}) {\n`

            for (const col in columns) {
                const sanitisedName = escapeChars(columns[col])
                genCode += `\t\tthis.${sanitisedName} = ${sanitisedName};\n`;
            }

            genCode += "\t}\n\n"

            genCode += "}"

            resultAreaRef.current!.value = genCode;
        } catch (e) {
            resultAreaRef.current!.value = `${e}`;
        }

    }, [csvData]);

    return <>
        <h1 className="text-xl font-bold">CSV to Java Enum</h1>
        <p>This is a tool for converting a CSV file of any length into a Java enum.</p>
        <p>Rules for successful conversion:</p>
        <ul className='list-disc ml-8'>
            <li>Must be a well formed CSV document</li>
            <li>First row must be column headers</li>
        </ul>
        <p>Hope it works :P</p>
        <p>The sample data provided is sourced from the New Zealand Government's <a href="" className="underline font-bold">National Dog Database Breeds</a>. It is used under the <i>Creative Commons Attribution 4.0 International license</i>.</p>
        <textarea ref={textAreaRef} className="w-full h-60 border-2 border-sky-500 rounded-md"></textarea>
        <div className='flex flex-col gap-2 md:flex-row md:gap-6 align-middle'>

            <button onClick={loadCsv} className="px-2 py-1.5 border-2 border-zinc-600 box-border rounded-lg bg-white">Load Sample</button>

            <div className="grow"/>

            <section className='flex gap-2 w-full md:w-auto items-center'>
                <label htmlFor="index" className="grow">Field Name Index:</label>
                <input type="number" id="index" defaultValue={fieldTitleIndex} onChange={(e) => setFieldTitleIndex(+e.target.value)} className="w-32 px-2 py-1.5 border-1 border-2 box-border rounded-lg border-zinc-600"></input>
            </section>
            
            <button onClick={doCsvParse} className="px-2 py-1.5 border-2 box-border rounded-lg bg-blue-500 border-blue-600 text-white">Generate</button>
        </div>
        {csvData !== null &&
            <textarea ref={resultAreaRef} className="w-full h-60 border-2 border-sky-500 rounded-md"></textarea>
        }
    </>
}

export default EnumConverter;

// Copyright NZ Government
// Source: https://catalogue.data.govt.nz/dataset/dog-breeds-and-colours/resource/aa7adb07-a5d5-4952-8817-407a3daea1a7
const testData =
`_id,CODE,NAME
1,ACAT,"Cattle, Australian"
2,ACOC,"Spaniel, American Cocker"
3,AFFE,Affenpinscher
4,AFGM,"Hound, Afghan"
5,AFHD,"Hound, American Fox"
6,AHWS,"Spaniel, American Water"
7,AIRE,"Terrier, Airedale"
8,AKIT,Akita
9,AKOO,Australian Koolie
10,AMAL,Alaskan Malamute
11,ANAT,"Shepherd, Anatolian"
12,ASTA,"Terrier, American Staffordshire"
13,ASTE,"Terrier, Australian Silky"
14,ATER,"Terrier, Australian"
15,AUST,"Shepherd, Australian"
16,AZAW,Azawakh
17,BAJI,Basenji
18,BASS,"Hound, Basset"
19,BBUL,Bulldog
20,BDCO,"Collie, Border"
21,BDTE,"Terrier, Border"
22,BEAG,Beagle
23,BEAU,Beauceron
24,BEDT,"Terrier, Bedlington"
25,BERG,Bergamasco Shepherd
26,BERN,Bernese Mountain
27,BFDB,Basset Fauve de Bretagne
28,BFIL,Brazilian Fila
29,BICH,Bichon Frise
30,BLOO,Bloodhound
31,BOLO,Bolognese
32,BORZ,Borzoi
33,BOST,"Terrier, Boston"
34,BOUV,Bouvier des Flandres
35,BOXE,Boxer
36,BRAC,Bracco Italiano
37,BRIA,Briard
38,BRSP,Brittany
39,BTER,"Terrier, Black Russian"
40,BULA,"Bulldog, American"
41,BUMA,"Mastiff, Bull"
42,BUTE,"Terrier, Bull"
43,BUTM,"Terrier, Bull Miniature"
44,CALE,Catahoula Leopard
45,CANA,Canaan
46,CCRE,"Retriever, Curly-Coated"
47,CEAS,"Shepherd, Central Asian"
48,CESK,Canadian Eskimo Dog
49,CEST,"Terrier, Cesky"
50,CFOU,Cesky Fousek
51,CHEA,"Retriever, Chesapeake Bay"
52,CHIL,"Chihuahua, Long Coat"
53,CHIN,Chinese Crested
54,CHIS,"Chihuahua, Smooth Coat"
55,CHOW,Chow Chow
56,CKCS,"Spaniel, Cavalier King Charles"
57,CLUM,"Spaniel, Clumber"
58,COCK,"Spaniel, Cocker"
59,COLB,"Collie, Bearded"
60,COLR,"Collie, Rough"
61,COLS,"Collie, Smooth"
62,COOB,"Coonhound, Bluetick"
63,COOE,"Coonhound, English"
64,COOP,"Coonhound, Plott"
65,COOR,"Coonhound, Redbone"
66,COOT,"Coonhound, Black and Tan"
67,CORC,"Corgi, Welsh Cardigan"
68,CORP,"Corgi, Welsh Pembroke"
69,CRNT,"Terrier, Cairn"
70,CRXX,Cross
71,DADT,"Terrier, Dandie Dinmont"
72,DALM,Dalmatian
73,DEER,Deerhound
74,DING,Dingo
75,DOBE,Dobermann
76,DODB,Dogue de Bordeaux
77,DOGO,Dogo Argentino
78,DUTC,"Shepherd, Dutch"
79,ELKH,"Elkhound, Norwegian"
80,EPOI,"Pointer, English"
81,ESET,"Setter, English"
82,ESSP,"Spaniel, English Springer"
83,ESTR,Estrela Mountain Dog
84,ETTE,"Terrier, English Toy (Black & Tan)"
85,EURA,Eurasier
86,FBUL,"Bulldog, French"
87,FCRE,"Retriever, Flat-Coated"
88,FISP,"Spitz, Finnish"
89,FLAP,"Lapphund, Finnish"
90,FOXH,Foxhound
91,FSPA,"Spaniel, Field"
92,FTSM,"Terrier, Fox (Smooth)"
93,FTWR,"Terrier, Fox (Wire)"
94,GBGV,Grand Basset Griffon Vendeen
95,GBSH,"Shepherd, Belgian (Groenendael)"
96,GDAN,Great Dane
97,GEHU,"Terrier, German Hunting"
98,GERP,"Pinscher, German"
99,GERS,"Shepherd, German"
100,GESK,"Spitz, German (Klein)"
101,GESP,"Spitz, German (Mittel)"
102,GITE,"Terrier, Glen of Imaal"
103,GOLD,"Retriever, Golden"
104,GORD,"Setter, Gordon"
105,GREY,Greyhound
106,GRIB,"Griffon, Beauceron"
107,GRIF,"Griffon, Bruxellois"
108,GSCH,"Schnauzer, Giant"
109,GSHP,"Pointer, German Short Haired"
110,GSMD,Great Swiss Mountain Dog
111,GWHP,"Pointer, German Wire Haired"
112,HAHA,Hamiltonstovare
113,HARR,Harrier
114,HAVA,Havanese
115,HEAD,Heading
116,HPUL,"Puli, Hungarian"
117,HUNT,Huntaway
118,HVIZ,"Vizsla, Hungarian"
119,ICEL,Icelandic Sheepdog
120,ICOR,Italian Corso Dog
121,IHOU,"Hound, Ibizan"
122,ISER,"Setter, Irish Red & White"
123,ISET,"Setter, Irish"
124,ITER,"Terrier, Irish"
125,ITGR,"Greyhound, Italian"
126,ITSP,"Spinone, Italian"
127,IWHD,"Wolfhound, Irish"
128,IWSP,"Spaniel, Irish Water"
129,JACK,"Terrier, Jack Russell"
130,JCHI,Japanese Chin
131,JIKO,Korea Jindo
132,JSPI,"Spitz, Japanese"
133,JTOS,"Tosa, Japanese"
134,KANG,Kangal
135,KCSP,"Spaniel, King Charles"
136,KEES,Keeshond
137,KELP,Australian Kelpie
138,KERR,"Terrier, Kerry Blue"
139,KOMO,Komondor
140,KUVA,Kuvasz
141,LABR,"Retriever, Labrador"
142,LAGO,Lagotto Romagnolo
143,LAKE,"Terrier, Lakeland"
144,LBSH,"Shepherd, Belgian (Laekenois)"
145,LEON,Leonberger
146,LHAS,Lhasa Apso
147,LOWC,Lowchen
148,LURC,Lurcher
149,MALT,Maltese
150,MANC,"Terrier, Manchester"
151,MARA,"Sheepdog, Maremma"
152,MAST,Mastiff
153,MBSH,"Shepherd, Belgian (Malinois)"
154,MLHD,"Dachshund, Miniature Long Haired"
155,MPIN,"Pinscher, Miniature"
156,MPOO,"Poodle, Miniature"
157,MSCH,"Schnauzer, Miniature"
158,MSHD,"Dachshund, Miniature Smooth Haired"
159,MUNS,Munsterlander
160,MWHD,"Dachshund, Miniature Wire Haired"
161,NBUH,Norwegian Buhund
162,NEMA,"Mastiff, Neapolitan"
163,NEWF,Newfoundland
164,NOTE,"Terrier, Norwich"
165,NSDT,"Retriever, Nova Scotia Duck Tolling"
166,NTER,"Terrier, Norfolk"
167,OESD,"Sheepdog, Old English"
168,OTTO,"Hound, Otter"
169,PAPI,Papillon
170,PEBA,Petit Basset Griffon Vendeen
171,PEKE,Pekingese
172,PERO,Perro sin pelo del Peru
173,PHAR,"Hound, Pharaoh"
174,PITB,"Terrier, American Pit Bull"
175,PJAC,"Terrier, Parson Jack Russell"
176,PLSH,"Sheepdog, Polish Lowland"
177,PMAS,"Mastiff, Pyrenean"
178,POME,Pomeranian
179,POPO,Portuguese Podengo
180,PORW,Portuguese Water
181,PRES,Perro de Presa Canario
182,PUGG,Pug
183,PUMI,Pumi
184,PYRE,Pyrenean Mountain
185,PYSH,"Shepherd, Pyrenean"
186,RIDG,Rhodesian Ridgeback
187,ROTT,Rottweiler
188,RTOY,Russian Toy
189,SALU,Saluki
190,SAMO,Samoyed
191,SBTE,"Terrier, Staffordshire Bull"
192,SCHI,Schipperke
193,SCHN,Schnauzer
194,SCOT,"Terrier, Scottish"
195,SEAL,"Terrier, Sealyham"
196,SHAR,Shar Pei
197,SHBA,Shiba Inu
198,SHIH,Shih Tzu
199,SHSH,"Sheepdog, Shetland"
200,SIBE,Siberian Husky
201,SKYE,"Terrier, Skye"
202,SLAP,"Lapphund, Swedish"
203,SLHD,"Dachshund, Standard Long Haired"
204,SLOU,Sloughi
205,SMIT,Smithfield
206,SOFT,"Terrier, Soft Coated Wheaten"
207,SPAW,Spanish Water
208,SPMA,"Mastiff, Spanish"
209,SPOO,"Poodle, Standard"
210,SSHD,"Dachshund, Standard Smooth Haired"
211,SSPA,"Spaniel, Sussex"
212,STBN,Saint Bernard
213,STCA,"Cattle, Stumpy-Tail"
214,SVAL,Swedish Vallhund
215,SWHD,"Dachshund, Standard Wire Haired"
216,TBSH,"Shepherd, Belgian (Tervueren)"
217,TCOO,"Coonhound, Tree Walker"
218,TIBS,"Spaniel, Tibetan"
219,TIBT,"Terrier, Tibetan"
220,TMAS,"Mastiff, Tibetan"
221,TPOO,"Poodle, Toy"
222,TRID,Thai Ridgeback
223,TTER,"Terrier, Tenterfield"
224,WEIM,Weimaraner
225,WEST,"Terrier, West Highland White"
226,WHIP,Whippet
227,WSSD,White Swiss Shepherd Dog
228,WSSP,"Spaniel, Welsh Springer"
229,WTER,"Terrier, Welsh"
230,XOLO,Xoloitzquintle
231,YORK,"Terrier, Yorkshire"
`;