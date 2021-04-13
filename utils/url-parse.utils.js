function getDownloadPathWithoutDomainAndOrganisation(url) {
    const domainAndOrganization = getDomainAndOrganization(url);
    const project = getProject(url, domainAndOrganization);
    const repositoryName = getRepositoryName(url);
    const path = getPath(url);

    return `/${project}/_apis/git/repositories/${repositoryName}/items?path=${path}`;
}

function getDomainAndOrganization(url) {
    if (url.includes("dev.azure.com")) {
        const organizationRegexString = "(?<=dev.azure.com/)(.*?)(?=/)";
        const organization = getMatchOrThrowError(
            url,
            organizationRegexString,
            "Organization"
        );

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
    const projectRegexString = `(?<=${domainAndOrganization}/)(.*?)(?=\/_git)`;
    return getMatchOrThrowError(url, projectRegexString, "Project");
}

function getRepositoryName(url) {
    const repoRegexString = `(?<=_git/)(.*?)(?=\\?path)`;
    return getMatchOrThrowError(url, repoRegexString, "Repository name");
}

function getPath(url) {
    if (!url.includes(".json")) {
        throw new Error("Only (.json) files are supported.");
    }

    const pathRegexString = `(?<=path=)(.*?)(?=.json)`;
    return getMatchOrThrowError(url, pathRegexString, "Path") + ".json";
}

function throwParseError(missing) {
    throw new Error(
        `'${missing}' can't be found in URL. \nTry to find desired (.json) file starting from domain (e.g. dev.azure.com) and use this URL.`
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
