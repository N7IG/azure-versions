function getDownloadPathWithoutDomainAndOrganisation(url) {
    const domainAndOrganization = getDomainAndOrganization(url);
    const project = getProject(url, domainAndOrganization);
    const repositoryName = getRepositoryName(url);
    const path = getPath(url);

    return `/${project}/_apis/git/repositories/${repositoryName}/items?path=${path}`;
}

function getDomainAndOrganization(url) {
    if (url.includes("dev.azure.com")) {
        const organization = url.match(/(?<=dev.azure.com\/)(.*?)(?=\/)/g)[0];
        console.log("organization", organization);

        return `dev.azure.com/${organization}`;
    }

    if (url.includes(".visualstudio.com")) {
        const endOrgIndex = url.indexOf(".visualstudio.com");
        const organization = url
            .substring(0, endOrgIndex)
            .replace("https://", "")
            .replace("http://", "");

        return `${organization}.visualstudio.com`;
    }

    throw new Error("Azure domain can't be parsed.");
}

function getProject(url, domainAndOrganization) {
    const projectRegexString = `(?<=${domainAndOrganization}/)(.*?)(?=/)`;
    return getMatchOrThrowError(url, projectRegexString, "Project");
}

function getRepositoryName(url) {
    const repoRegexString = `(?<=_git/)(.*?)(?=\\?path)`;
    return getMatchOrThrowError(url, repoRegexString, "Repository name");
}

function getPath(url) {
    const pathRegexString = `(?<=path=)(.*?)(?=.json)`;
    return (
        getMatchOrThrowError(url, pathRegexString, "Repository name") + ".json"
    );
}

function throwParseError(missing) {
    throw new Error(
        `'${missing}' can't be found in URL. Try to find desired .json file starting from domain (e.g. dev.azure.com) and use this URL.`
    );
}

function getMatchOrThrowError(url, regExpString, segment) {
    const matchArray = url.match(new RegExp(regExpString, "g"));
    const match = matchArray && matchArray[0];

    if (!match) {
        throwParseError(segment);
    }
    return match;
}
