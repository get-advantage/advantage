import Papa from 'papaparse';
// Source sheet is => https://docs.google.com/spreadsheets/d/1YyTX-Xz8Zzc28PPwDiP1mUhgSpu2WgYiszOWf8nYLr8/edit?gid=1389366370#gid=1389366370
// SHEET_ID is the ID of the published Google Sheet
const SHEET_ID = '2PACX-1vRWhD4vLV2DxQy1OB8nGOzwAYeSnxu0-hoQfYJ4qXzSmpTIqsycG6Bepq5ftIjPekXdkfxZPeX1bPWd';
// TAB_ID is the ID of the tab in the Google Sheet, currently named Main
const TAB_ID = '1389366370';
enum FORMATS {
    MIDSCROLL = "Midscroll",
    TOPSCROLL = "Topscroll"
}

enum BUYING_TYPE {
    DIRECT_IO = "Direct I/O",
    PROGRAMMATIC = "Programmatic"
}

// Interface for a single site
interface Site {
    publisherName: string;
    site: string;
    siteUrl: string;
    formatsMobile: FORMATS[];
    formatsDesktop: FORMATS[];
    buyingType?: BUYING_TYPE[];
}


export async function getCertifiedSites(rowData: any) {
    const url = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${TAB_ID}&single=true&output=csv`;
    try {
        const response = await fetch(url);
        const csvData = await response.text();
        const parsedData = Papa.parse(csvData, { header: true });
        rowData.value = parsedData.data.map( sheet => {
            return <Site>{
                country: sheet.Country,
                publisherName: sheet.Publisher,
                site: sheet['Site Name'],
                siteUrl: sheet['Site URL'],
                formatsMobile: sheet['Format Mobile'].split(','),
                formatsDesktop: sheet['Format Desktop'].split(',')
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
