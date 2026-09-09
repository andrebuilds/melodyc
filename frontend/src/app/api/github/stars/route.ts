const githubRepositoryApiUrl =
  "https://api.github.com/repos/andrebuilds/melodyc";

export async function GET() {
  const response = await fetch(githubRepositoryApiUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return Response.json(
      { error: "Unable to retrieve GitHub stars" },
      { status: 502 },
    );
  }

  const repository: unknown = await response.json();

  if (
    typeof repository !== "object" ||
    repository === null ||
    !("stargazers_count" in repository) ||
    typeof repository.stargazers_count !== "number"
  ) {
    return Response.json(
      { error: "GitHub returned an invalid response" },
      { status: 502 },
    );
  }

  return Response.json({ stars: repository.stargazers_count });
}
