import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { ReposContext } from "./ReposContext";
import type { RepositoryCardData } from "@/types/repository";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI as string;

const ReposProvider: FC<PropsWithChildren> = ({ children }) => {
  const [repos, setRepos] = useState<RepositoryCardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const location = window.location.href;
  const code = location?.split("?")[1]?.split("=")[1] || "";

  async function handleLoginWithGithub() {
    try {
      setPending(true);
      const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: GITHUB_REDIRECT_URI,
        scope: "read:user repo",
      });

      window.location.assign(
        `https://github.com/login/oauth/authorize?${params.toString()}`
      );

      const response = await fetch(`${BASE_URL}/accessToken?code=${code}`);
      const data = await response.json();
      console.log(data);
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
        setToken(data.access_token as string);
        return { success: true, message: "success login" };
      }
      return { success: false, message: "login failed" };
    } catch (error) {
      console.log(error);
      return { success: false, message: (error as Error).message };
    } finally {
      setPending(false);
    }
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setToken(null);
    window.location.assign("/");
  }

  async function handleGetRepos() {
    try {
      setPending(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/repos?token=${token}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.repos) {
        setRepos(data.repos);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPending(false);
    }
  }
  useEffect(() => {
    handleGetRepos();
  }, [code]);

  return (
    <ReposContext.Provider
      value={{
        repos,
        setRepos,
        handleLoginWithGithub,
        logout,
        handleGetRepos,
        token,
        error,
        pending,
      }}
    >
      {children}
    </ReposContext.Provider>
  );
};

export default ReposProvider;
