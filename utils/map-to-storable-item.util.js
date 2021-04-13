/**
 * Creates config for storing by adding downloadPath to user entered config
 */
function mapToStorableItem({ name, pageUrl }) {
    return {
        name,
        pageUrl,
        downloadPath: getDownloadPathWithoutDomainAndOrganisation(pageUrl)
    };
}
