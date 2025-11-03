import { RepoCard } from "@/components/repo/RepoCard";
import { Button } from "@/components/ui/button";
import { useRepos } from "@/context/ReposContext";

const UserPage = () => {
  const { handleLoginWithGithub, logout, token, repos, pending, error } =
    useRepos();
  if (pending)
    return (
      <div className="min-h-screen w-full flex items-start justify-center">
        <span className="font-bold text-2xl text-black mt-90">Loading...</span>
      </div>
    );

  if (error)
    return (
      <div className="p-2 text-red-500 bg-red-200 rounded-2xl text-sm">
        <p>{error}</p>
      </div>
    );
  return (
    <div>
      {token ? (
        <>
          <Button onClick={logout}>Logout</Button>
          {/* <Button onClick={handleGetRepos}>Get User Repos</Button> */}
          {repos.length > 0 && (
            <>
              {pending ? (
                <div className="min-h-screen w-full flex items-start justify-center">
                  <span className="font-bold text-2xl text-black mt-90">
                    Loading...
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-1/2 m-auto space-y-4">
                    {repos.map((repo) => {
                      return <RepoCard key={repo.id} repo={repo} />;
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Button disabled={pending} onClick={handleLoginWithGithub}>
            {pending ? "Logging..." : "Login With Github"}
          </Button>
        </>
      )}
    </div>
  );
};

export default UserPage;
