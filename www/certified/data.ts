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
    site: string;
    siteUrl: string;
    formatsMobile: FORMATS[];
    formatsDesktop: FORMATS[];
    buyingType?: BUYING_TYPE[];
}

// Interface for a publisher
interface Publisher {
    country: string;
    sites: Site[];
}

// Interface for the full structure
interface Publishers {
    [publisherName: string]: Publisher;
}

const data = {
    publishers: {
        "Stampen Media": {
            country: "Sweden",
            sites: [
                {
                    site: "Göteborgs Posten",
                    siteUrl: "https://www.gp.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Alingsås Tidning",
                    siteUrl: "https://www.alingsastidning.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Bohusläningen",
                    siteUrl: "https://www.bohuslaningen.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Hallands Nyheter",
                    siteUrl: "https://www.hn.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Hallandsposten",
                    siteUrl: "https://www.hallandsposten.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Kungsbackaposten",
                    siteUrl: "https://www.kungsbackaposten.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Kungälvsposten",
                    siteUrl: "https://www.kungalvsposten.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "ST-tidningen",
                    siteUrl: "https://www.sttidningen.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Möndalsposten",
                    siteUrl: "https://www.molndalsposten.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Strömstadstidning",
                    siteUrl: "https://www.stromstadstidning.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "TTELA",
                    siteUrl: "https://www.ttela.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                },
                {
                    site: "Härrydaposten",
                    siteUrl: "https://www.harrydaposten.se",
                    formatsDesktop: [FORMATS.MIDSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL]
                }
            ]
        },
        "AFV Media AB": {
            country: "Sweden",
            sites: [
                {
                    site: "Affärsvärlden",
                    siteUrl: "https://www.affarsvarlden.se/",
                    formatsDesktop: [FORMATS.MIDSCROLL, FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL, FORMATS.TOPSCROLL]
                }
            ]
        },
        "Raskimedia": {
            country: "Sweden",
            sites: [
                {
                    site: "Allt om Elbil",
                    siteUrl: "https://alltomelbil.se/",
                    formatsDesktop: [FORMATS.MIDSCROLL, FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.MIDSCROLL, FORMATS.TOPSCROLL]
                }
            ]
        },
        "Ängsjödal Text AB": {
            country: "Sweden",
            sites: [
                {
                    site: "Cornucopia",
                    siteUrl: "https://cornucopia.se/",
                    formatsDesktop: [FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.TOPSCROLL]
                }
            ]
        },
        "Enento Group": {
            country: "Sweden",
            sites: [
                {
                    site: "Allabolag",
                    siteUrl: "https://www.allabolag.se/",
                    formatsDesktop: [FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.TOPSCROLL]
                }
            ]
        },
        "Börsforum Sverige AB": {
            country: "Sweden",
            sites: [
                {
                    site: "Nyemissioner",
                    siteUrl: "https://nyemissioner.se/",
                    formatsDesktop: [FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.TOPSCROLL]
                }
            ]
        },
        "Blendow Group": {
            country: "Sweden",
            sites: [
                {
                    site: "Dagens Juridik",
                    siteUrl: "https://www.dagensjuridik.se/",
                    formatsDesktop: [FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.TOPSCROLL]
                }
            ]
        },
        "Motivation Media Group Stockholm AB": {
            country: "Sweden",
            sites: [
                {
                    site: "Motivation.se",
                    siteUrl: "https://motivation.se/",
                    formatsDesktop: [FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.TOPSCROLL]
                }
            ]
        },
        "Placera Media": {
            country: "Sweden",
            sites: [
                {
                    site: "Placera",
                    siteUrl: "https://www.placera.se/",
                    formatsMobile: [FORMATS.TOPSCROLL, FORMATS.MIDSCROLL],
                }
            ]
        },
        "Aktiespararna": {
            country: "Sweden",
            sites: [
                {
                    site: "Aktiespararna",
                    siteUrl: "https://www.aktiespararna.se/",
                    formatsDesktop: [FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.TOPSCROLL]
                }
            ]
        },
        "Bilweb AB": {
            country: "Sweden",
            sites: [
                {
                    site: "Bilweb",
                    siteUrl: "https://www.bilweb.se/",
                    formatsDesktop: [FORMATS.TOPSCROLL],
                    formatsMobile: [FORMATS.TOPSCROLL]
                }
            ]
        },
    } as Publishers
};

export function getData() {
    const transformedObjects: any[] = [];

    // iterate over object keys
    const hej = Object.entries(data.publishers).forEach(
        ([pubName, publisher]) => {
            publisher.sites.forEach((site) => {
                transformedObjects.push({
                    country: publisher.country,
                    publisherName: pubName,
                    site: site.site,
                    siteUrl: site.siteUrl,
                    formatsMobile: site.formatsMobile,
                    formatsDesktop: site.formatsDesktop
                });
            });
        }
    );
    return transformedObjects;
}
